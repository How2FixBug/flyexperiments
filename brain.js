// Real connectome-derived locomotor circuit for Fly Experiments.
// Circuit: MaleCNS v1.0, 1,045 neurons and 17,224 directed connections.
// The circuit JSON is CC BY 4.0; see ATTRIBUTION.md.
const DATA_URL = "https://raw.githubusercontent.com/DenisSergeevitch/desktop-fly/master/data/locomotor_circuit.json";
const MODULE_URL = "https://raw.githubusercontent.com/DenisSergeevitch/desktop-fly/master/windows/src/locomotor.js";

export async function loadBrain() {
  const [module, response] = await Promise.all([
    import(MODULE_URL),
    fetch(DATA_URL, { cache: "force-cache" })
  ]);
  if (!response.ok) throw new Error(`Connectome download failed: HTTP ${response.status}`);
  const circuit = await response.json();
  if (!module.validateLocomotorCircuit(circuit)) throw new Error("Connectome validation failed");
  return new module.LocomotorSim(circuit);
}

// Feedback is returned from the six leg joints. Descending drive is a modeled
// external command; all interneuron and motor activity downstream is simulated
// through the measured MaleCNS graph.
export function tickBrain(brain, feedback, steering, milliseconds = 8) {
  brain.feedback = feedback;
  brain.setDescending("DNp09", "left", 14);
  brain.setDescending("DNp09", "right", 14);
  brain.setDescending("DNa01", "left", Math.max(0, steering) * 18);
  brain.setDescending("DNa02", "left", Math.max(0, -steering) * 18);
  brain.setDescending("DNa01", "right", Math.max(0, -steering) * 18);
  brain.setDescending("DNa02", "right", Math.max(0, steering) * 18);
  brain.step(milliseconds);
  return brain.commands;
}
