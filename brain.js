// Connectome -> motor neurons -> six-leg mechanics -> sensory feedback loop.
const ROOT = "https://cdn.jsdelivr.net/gh/DenisSergeevitch/desktop-fly@master/windows/src/";
const DATA = "https://cdn.jsdelivr.net/gh/DenisSergeevitch/desktop-fly@master/data/locomotor_circuit.json";

export async function loadBrain() {
  const [neural, mechanics, response] = await Promise.all([
    import(ROOT + "locomotor.js"),
    import(ROOT + "legdynamics.js"),
    fetch(DATA, { cache: "force-cache" })
  ]);
  if (!response.ok) throw new Error("Connectome fetch failed: HTTP " + response.status);
  const circuit = await response.json();
  if (!neural.validateLocomotorCircuit(circuit)) throw new Error("MaleCNS circuit failed validation");
  const sim = new neural.LocomotorSim(circuit);
  const geometries = Array.from({length:6}, (_, leg) => ({
    femur: leg < 2 ? 0.24 : 0.27,
    tibia: leg < 2 ? 0.30 : 0.34,
    tarsus: 0.22,
    attachX: leg < 2 ? -0.18 : leg < 4 ? 0.02 : 0.23,
    attachY: (leg % 2 ? 1 : -1) * 0.22,
    attachZ: 0.43,
    baseYaw: (leg % 2 ? 1 : -1) * 0.12,
    side: leg % 2 ? 1 : -1
  }));
  return { sim, body: new mechanics.SixLegDynamics(geometries), spikes: 0 };
}

export function tickBrain(system, steering, dt) {
  const {sim, body} = system;
  const ms = Math.max(1, Math.min(40, Math.round(dt * 1000)));
  const feedback = body.feedback;
  sim.feedback = feedback;
  // DNp09 provides modeled forward-walking drive; DNa descending neurons
  // receive the cursor-derived steering signal.
  sim.setDescending("DNp09", "left", 12);
  sim.setDescending("DNp09", "right", 12);
  sim.setDescending("DNa01", "left", Math.max(0, steering) * 14);
  sim.setDescending("DNa02", "left", Math.max(0, -steering) * 14);
  sim.setDescending("DNa01", "right", Math.max(0, -steering) * 14);
  sim.setDescending("DNa02", "right", Math.max(0, steering) * 14);
  sim.step(ms);
  const movement = body.advance(sim.commands, dt, true);
  system.spikes = sim.totalSpikes;
  return {
    movement,
    legs: body.legs.map(leg => ({...leg.feedback})),
    motorSpikes: sim.motorSpikes,
    sensorySpikes: sim.sensorySpikes,
    totalSpikes: sim.totalSpikes
  };
}
