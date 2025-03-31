# Sprite Sheet Template Guide

## Structure
The template sprite sheet (`character-template.png`) is set up with the following specifications:

- **Total Size**: 384x48 pixels
- **Frame Size**: 32x48 pixels each
- **Number of Frames**: 9 frames total
- **Layout**: Single row, left to right

## Frame Layout
1. **Frames 0-3**: Walking Left Animation
   - Frame 0: Left walk pose 1
   - Frame 1: Left walk pose 2
   - Frame 2: Left walk pose 3
   - Frame 3: Left walk pose 4

2. **Frame 4**: Idle/Standing
   - Center frame for when character is not moving

3. **Frames 5-8**: Walking Right Animation
   - Frame 5: Right walk pose 1
   - Frame 6: Right walk pose 2
   - Frame 7: Right walk pose 3
   - Frame 8: Right walk pose 4

## How to Customize
1. Open `character-template.png` in an image editor (e.g., Photoshop, GIMP)
2. Each frame is 32x48 pixels - maintain this grid when creating your character
3. Keep the same layout (left walk -> idle -> right walk)
4. Save with the same dimensions and format
5. Replace the existing sprite sheet in the game

## Animation Settings in game.js
```javascript
// Frame settings
frameWidth: 32,
frameHeight: 48

// Animation sequences
left: frames 0-3
idle: frame 4
right: frames 5-8

// Animation speed
frameRate: 10 (adjustable)
```
