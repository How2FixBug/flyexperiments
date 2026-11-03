# Connectome attribution

This project loads the MaleCNS v1.0 locomotor circuit extracted by DenisSergeevitch in [desktop-fly](https://github.com/DenisSergeevitch/desktop-fly).

- **Circuit data:** MaleCNS v1.0, licensed **CC BY 4.0**. Credit the MaleCNS collaboration: FlyEM / HHMI Janelia, University of Cambridge, MRC Laboratory of Molecular Biology, and Google Research.
- **Circuit simulator code:** adapted at runtime from [desktop-fly/windows/src/locomotor.js](https://github.com/DenisSergeevitch/desktop-fly/blob/master/windows/src/locomotor.js) and its [leg dynamics module](https://github.com/DenisSergeevitch/desktop-fly/blob/master/windows/src/legdynamics.js). The project's code is MIT licensed.
- **Circuit size:** 1,045 neurons and 17,224 directed connection edges (708,689 synaptic contacts).

The connectome provides measured anatomy and contact counts. Neuron excitability, synaptic dynamics, sensory tuning, descending drive, and the mapping from motor activity to the simplified browser fly are modeled assumptions. This is a connectome-derived motor-circuit simulation, not a complete replay of a living fly's nervous system and not a FlyGym physics simulation.

For background on FlyWire and the MaleCNS data, see [FlyWire Codex](https://codex.flywire.ai/) and the [MaleCNS dataset](https://male-cns.janelia.org/).


## Visual / descending brain circuit

- **Brain circuit data:** female adult FlyWire FAFB v783, derived from the public FlyWire connectome and included in `desktop-fly/data/circuit.json`; licensed **CC BY-NC 4.0**. Cite Dorkenwald et al., *Nature* 634, 124–138 (2024), https://doi.org/10.1038/s41586-024-07558-y, and Schlegel et al., *Nature* 634, 139–152 (2024), https://doi.org/10.1038/s41586-024-07686-5.
- **Circuit simulator:** the LIF network implementation is loaded from [desktop-fly/windows/src/sim.js](https://github.com/DenisSergeevitch/desktop-fly/blob/master/windows/src/sim.js), MIT licensed.
- **Circuit scope:** 668 selected brain neurons and 18,968 directed edges, including LC4/LPLC2 looming-sensitive visual neurons and descending command neurons. The visual input is a modeled angular-expansion signal, not raw camera/retina pixels. The brain and nerve-cord datasets are different specimens; their descending-neuron interface is an explicit model assumption.
