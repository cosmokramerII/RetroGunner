interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function checkAABBCollision(rect1: AABB, rect2: AABB): boolean {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export function checkPointInAABB(point: { x: number; y: number }, rect: AABB): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function getAABBOverlap(rect1: AABB, rect2: AABB): { x: number; y: number } {
  const overlapX = Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x);
  const overlapY = Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y);
  
  return { x: overlapX, y: overlapY };
}
