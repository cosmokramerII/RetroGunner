import * as THREE from "three";

export function createPixelTexture(width: number, height: number, pixels: number[][]): THREE.DataTexture {
  const data = new Uint8Array(width * height * 4);
  
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const pixel = pixels[i][j];
      const index = (i * width + j) * 4;
      
      data[index] = (pixel >> 16) & 0xff; // Red
      data[index + 1] = (pixel >> 8) & 0xff; // Green
      data[index + 2] = pixel & 0xff; // Blue
      data[index + 3] = pixel === 0 ? 0 : 255; // Alpha
    }
  }
  
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  
  return texture;
}

export function createSpriteSheet(sprites: { [key: string]: number[][] }): { [key: string]: THREE.DataTexture } {
  const textures: { [key: string]: THREE.DataTexture } = {};
  
  for (const [name, pixels] of Object.entries(sprites)) {
    const height = pixels.length;
    const width = pixels[0].length;
    textures[name] = createPixelTexture(width, height, pixels);
  }
  
  return textures;
}

// Retro NES color palette
export const NES_COLORS = {
  BLACK: 0x000000,
  WHITE: 0xffffff,
  RED: 0xff0000,
  GREEN: 0x00ff00,
  BLUE: 0x0000ff,
  YELLOW: 0xffff00,
  CYAN: 0x00ffff,
  MAGENTA: 0xff00ff,
  DARK_GRAY: 0x404040,
  LIGHT_GRAY: 0xc0c0c0,
  ORANGE: 0xff8000,
  BROWN: 0x8b4513,
  PINK: 0xffc0cb,
  PURPLE: 0x800080
};
