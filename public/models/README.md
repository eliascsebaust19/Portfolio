# 3D Avatar Model Placement

Place Elias Ahmad's realistic GLB avatar at:

`public/models/elias-avatar.glb`

## Guidelines for the GLB Asset
- Format: Binary glTF (`.glb`), ideally Draco-compressed for fast loading (< 5 MB recommended).
- Orientation: Facing `+Z` camera, centered at origin `(0, 0, 0)` with feet near `y = 0` or bust centered cleanly.
- Optional Rigging / Animations:
  - Embedded idle animation clips (e.g., `Idle`, `Breathing`) are automatically detected and played via `THREE.AnimationMixer`.
  - Head/neck bones (`Head`, `Neck`, `spine006`, `spine005`, `mixamorigHead`, `mixamorigNeck`) are automatically detected for smooth pointer tracking.
- Until `elias-avatar.glb` is added, the portfolio displays a clean interactive 3D stage and static fallback without fabricating a fake 3D human model.
