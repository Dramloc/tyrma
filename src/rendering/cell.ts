import * as Grid from "../utils/grid";
import { memoize } from "../utils/memoize";

const packNeighboors = (x: number, y: number, grid: Grid.Grid<boolean>): number => {
  // Pack the neighboors and the cell at a (x, y) location into a number
  // This is used to simplify memoization of the draw operations for this cell
  // (for a given neighboorhood, we always have the same draw operations)
  //
  // The neighboorhood is a 3-wide 5-high area centerer around the cell location.
  // Packing process each row (starting from the north) and each cell of this row (starting from the west).
  // For example, given the following neighboorhood:
  // 🧱🧱⬛     [false, false, true ,
  // 🧱⬛⬛      false, true , true ,
  // 🧱⬛🧱      false, true , false,
  // 🧱⬛🧱      false, true , false,
  // ⬛🧱⬛      true , false, true ]
  // We will browse cells in this order: 🧱,🧱,⬛,🧱,⬛,⬛,🧱,⬛,🧱,🧱,⬛,🧱,⬛,🧱,⬛
  // At each step, a cell is added to the output and the output is shifted left:
  // 1: 🧱 (0b1)
  // 2: 🧱🧱 (0b11)
  // 3: 🧱🧱⬛ (0b110)
  // ...
  // 15: 🧱🧱⬛🧱⬛⬛🧱⬛🧱🧱⬛🧱⬛🧱⬛ (0b110100101101010)
  let output = 0;
  let index = 0;
  for (let j = y - 2; j <= y + 2; j++) {
    for (let i = x - 1; i <= x + 1; i++) {
      output |= ((Grid.get(i, j, grid) as unknown) as number) << index;
      index++;
    }
  }
  return output;
};

const getDrawImageOperationsFromNeighboors = memoize((neighboors: number): [string, number, number][] => {
  const drawImageOperations: [string, number, number][] = [];
  const northNorthWest = neighboors & 1;
  const northWest = neighboors & (1 << 3);
  const north = neighboors & (1 << 4);
  const northEast = neighboors & (1 << 5);
  const west = neighboors & (1 << 6);
  const value = neighboors & (1 << 7);
  const east = neighboors & (1 << 8);
  const southWest = neighboors & (1 << 9);
  const south = neighboors & (1 << 10);
  const southEast = neighboors & (1 << 11);
  const southSouthWest = neighboors & (1 << 12);
  const southSouth = neighboors & (1 << 13);
  const southSouthEast = neighboors & (1 << 14);

  if (value) {
    // Floor
    drawImageOperations.push(["floor", 0, 0]);
    if (!west && !north) {
      drawImageOperations.push(["shadowout-north-west", 0, 0]);
    }
    if (!west && north) {
      if (!northWest) {
        if (!northNorthWest) {
          drawImageOperations.push(["shadow-west", 0, 0]);
        } else {
          drawImageOperations.push(["shadow-north-west-west", 0, 0]);
        }
      }
    }
    if (west && !north) {
      if (!northWest) {
        drawImageOperations.push(["shadow-north", 0, 0]);
      } else {
        drawImageOperations.push(["shadow-north-north-west", 0, 0]);
      }
    }
    if (!northWest && north && west) {
      drawImageOperations.push(["shadowin-north-west", 0, 0]);
    }
  } else {
    if (south) {
      // Wall front face
      // 🧱🧱🧱
      // ⬛⬛⬛
      drawImageOperations.push(["wall", 0, 0]);
      if ((!west && !southWest) || west) {
        // Wall front face west half if there is an adjacent wall to the west
        // 🧱🧱🧱 or ⬛🧱🧱
        // 🧱⬛⬛    ⬛⬛⬛
        drawImageOperations.push(["wall-west", 0, 0]);
      }
      if ((!east && !southEast) || east) {
        // Wall front face east half if there is an adjacent wall to the east
        // 🧱🧱🧱 or 🧱🧱⬛
        // ⬛⬛🧱    ⬛⬛⬛
        drawImageOperations.push(["wall-east", 8, 0]);
      }
    } else {
      // Filled wall
      drawImageOperations.push(["wallfull", 0, 0]);

      // North wall top
      if (southSouth) {
        drawImageOperations.push(["walltop-north", 0, 8]);
      }
      if (southSouth && !southSouthEast) {
        drawImageOperations.push(["walltop-north-north-east", 8, 8]);
      }
      if (southSouth && !southSouthWest) {
        drawImageOperations.push(["walltop-north-north-west", 0, 8]);
      }

      // East wall top
      if (west || southWest) {
        drawImageOperations.push(["walltop-east", 0, 0]);
      }
      if (west && !southWest) {
        drawImageOperations.push(["walltop-south-east-east", 0, 8]);
      }
      if (southWest && !west) {
        drawImageOperations.push(["walltop-north-east-east", 0, 0]);
      }

      // West wall top
      if (east || southEast) {
        drawImageOperations.push(["walltop-west", 8, 0]);
      }
      if (east && !southEast) {
        drawImageOperations.push(["walltop-south-west-west", 8, 8]);
      }
      if (southEast && !east) {
        drawImageOperations.push(["walltop-north-west-west", 8, 0]);
      }

      // South wall top
      if (north) {
        drawImageOperations.push(["walltop-south", 0, 0]);
      }
      if (north && !northEast) {
        drawImageOperations.push(["walltop-south-south-east", 8, 0]);
      }
      if (north && !northWest) {
        drawImageOperations.push(["walltop-south-south-west", 0, 0]);
      }

      if (southSouthWest && !southWest && !south && !southSouth && !west) {
        drawImageOperations.push(["walltopcornerout-north-east", 0, 8]);
      }
      if (southSouthEast && !southEast && !south && !southSouth && !east) {
        drawImageOperations.push(["walltopcornerout-north-west", 8, 8]);
      }
      if (northWest && !north && !west) {
        drawImageOperations.push(["walltopcornerout-south-east", 0, 0]);
      }
      if (northEast && !north && !east) {
        drawImageOperations.push(["walltopcornerout-south-west", 8, 0]);
      }

      if (southSouth && southEast) {
        drawImageOperations.push(["walltopcornerin-north-west", 8, 8]);
      }

      if (southSouth && southWest) {
        drawImageOperations.push(["walltopcornerin-north-east", 0, 8]);
      }

      if (north && east) {
        drawImageOperations.push(["walltopcornerin-south-west", 8, 0]);
      }

      if (north && west) {
        drawImageOperations.push(["walltopcornerin-south-east", 0, 0]);
      }
    }
  }
  return drawImageOperations;
});

export const getDrawImageOperations = (x: number, y: number, grid: Grid.Grid<boolean>): [string, number, number][] => {
  return getDrawImageOperationsFromNeighboors(packNeighboors(x, y, grid));
};
