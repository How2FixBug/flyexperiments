# Connectome attribution

This project loads the MaleCNS v1.0 locomotor circuit extracted by DenisSergeevitch in [desktop-fly](https://github.com/DenisSergeevitch/desktop-fly).

- **Circuit data:** MaleCNS v1.0, licensed **CC BY 4.0**. Credit the MaleCNS collaboration: FlyEM / HHMI Janelia, University of Cambridge, MRC Laboratory of Molecular Biology, and Google Research.
- **Circuit simulator code:** adapted at runtime from [desktop-fly/windows/src/locomotor.js](https://github.com/DenisSergeevitch/desktop-fly/blob/master/windows/src/locomotor.js) and its [leg dynamics module](https://github.com/DenisSergeevitch/desktop-fly/blob/master/windows/src/legdynamics.js). The project's code is MIT licensed.
- **Circuit size:** 1,045 neurons and 17,224 directed connection edges (708,689 synaptic contacts).

The connectome provides measured anatomy and contact counts. Neuron excitability, synaptic dynamics, sensory tuning, descending drive, and the mapping from motor activity to the simplified browser fly are modeled assumptions. This is a connectome-derived motor-circuit simulation, not a complete replay of a living fly's nervous system and not a FlyGym physics simulation.

For background on FlyWire and the MaleCNS data, see [FlyWire Codex](https://codex.flywire.ai/) and the [MaleCNS dataset](https://male-cns.janelia.org/).
