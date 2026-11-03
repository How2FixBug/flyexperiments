// FAFB visual looming circuit -> descending neurons -> MaleCNS VNC -> six-leg mechanics.
// The two connectomes are different specimens; the descending-neuron interface is modeled.
const ROOT = "https://cdn.jsdelivr.net/gh/DenisSergeevitch/desktop-fly@master/windows/src/";
const BRAIN_DATA = "https://cdn.jsdelivr.net/gh/DenisSergeevitch/desktop-fly@master/data/circuit.json";
const VNC_DATA = "https://cdn.jsdelivr.net/gh/DenisSergeevitch/desktop-fly@master/data/locomotor_circuit.json";

export async function loadBrain() {
  const [neural, mechanics, brainResponse, vncResponse] = await Promise.all([
    import(ROOT + "sim.js"),
    import(ROOT + "legdynamics.js"),
    fetch(BRAIN_DATA, { cache: "force-cache" }),
    fetch(VNC_DATA, { cache: "force-cache" })
  ]);
  if (!brainResponse.ok) throw new Error("FAFB visual circuit fetch failed: HTTP " + brainResponse.status);
  if (!vncResponse.ok) throw new Error("MaleCNS locomotor circuit fetch failed: HTTP " + vncResponse.status);
  const [brainCircuit, vncCircuit] = await Promise.all([
    brainResponse.json(),
    vncResponse.json()
  ]);
  if (!brainCircuit.neurons?.length || !brainCircuit.edges?.length) {
    throw new Error("FAFB visual circuit is missing neurons or synapses");
  }
  if (!neural.LIFSim || !mechanics.SixLegDynamics) {
    throw new Error("Neural or mechanics module exports are unavailable");
  }

  // LIFSim runs the FAFB visual/descending circuit and relays its native
  // descending-neuron activity into the MaleCNS locomotor subgraph.
  const sim = new neural.LIFSim(brainCircuit, null, vncCircuit);
  const geometries = Array.from({ length: 6 }, (_, leg) => ({
    femur: leg < 2 ? 0.24 : 0.27,
    tibia: leg < 2 ? 0.30 : 0.34,
    tarsus: 0.22,
    attachX: leg < 2 ? -0.18 : leg < 4 ? 0.02 : 0.23,
    attachY: (leg % 2 ? 1 : -1) * 0.22,
    attachZ: 0.43,
    baseYaw: (leg % 2 ? 1 : -1) * 0.12,
    side: leg % 2 ? 1 : -1
  }));
  return { sim, body: new mechanics.SixLegDynamics(geometries) };
}

export function tickBrain(system, visual, dt) {
  const { sim, body } = system;
  const ms = Math.max(1, Math.min(40, Math.round(dt * 1000)));

  // A modeled optic-flow/looming measurement drives the identified LC4/LPLC2
  // visual populations. Their network output, not a scripted turn command,
  // determines descending activity sent to the nerve-cord locomotor circuit.
  sim.loomL = Math.max(0, Math.min(1, visual.left || 0));
  sim.loomR = Math.max(0, Math.min(1, visual.right || 0));
  sim.legFeedback = body.feedback;
  sim.step(ms);

  const movement = body.advance(sim.locomotor.commands, dt, true);
  return {
    movement,
    legs: body.legs.map(leg => ({ ...leg.feedback })),
    loomRate: sim.rateLoom,
    leftDescendingRate: sim.rateDNaL,
    rightDescendingRate: sim.rateDNaR,
    wingDrive: sim.rateEscW,
    escape: sim.consumeGF(),
    brainSpikes: sim.totalSpikes,
    motorSpikes: sim.locomotor.motorSpikes,
    sensorySpikes: sim.locomotor.sensorySpikes,
    totalSpikes: sim.totalSpikes + sim.locomotor.totalSpikes
  };
}
