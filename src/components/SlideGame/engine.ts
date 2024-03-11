import TinyQueue from "tinyqueue";

export const coordinates = (index: number, cols: number) => [
  index % cols,
  Math.floor(index / cols),
];

export const swap = <T>(tiles: Array<T>, a: number, b: number) => {
  [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
  return tiles;
};

export const misplaced = (tiles: number[]) =>
  tiles.reduce((acc, tile, index) => {
    if (tile === index || tile === tiles.length) {
      return acc;
    }
    return acc + 1;
  }, 0);

export const possibleMoves = (emptyIndex: number, cols: number) => {
  const [x, y] = coordinates(emptyIndex, cols);
  const moves = [];
  if (x > 0) moves.push(emptyIndex - 1);
  if (y > 0) moves.push(emptyIndex - cols);
  if (x < cols - 1) moves.push(emptyIndex + 1);
  if (y < cols - 1) moves.push(emptyIndex + cols);

  return moves;
};

function manhattan(state: number[]): number {
  // Implementation of the Manhattan Distance heuristic
  const cols = Math.sqrt(state.length);
  return state.reduce((total, currentValue, currentIndex) => {
    const [x, y] = coordinates(currentValue, cols);
    const [targetX, targetY] = coordinates(currentIndex, cols);
    return total + Math.abs(x - targetX) + Math.abs(y - targetY);
  }, 0);
}

class Iteration {
  readonly previous?: Iteration;
  readonly action?: number;
  readonly state: number[];
  readonly g: number;
  readonly h: number;
  readonly score: number;
  readonly cols: number;

  constructor(result: number[], previous?: Iteration, action?: number) {
    this.state = result;
    this.previous = previous;
    this.action = action;
    this.cols = previous?.cols ?? Math.sqrt(result.length);
    this.g = previous ? previous.g + 1 : 0;
    this.h = manhattan(result);
    this.score = this.g + this.h;
  }

  private *computeAvailableMovements() {
    const EMPTY_SLOT = this.state.length - 1;
    const emptyIndexIndex = this.state.indexOf(EMPTY_SLOT);
    for (const swapWith of possibleMoves(emptyIndexIndex, this.cols)) {
      const nextState = swap([...this.state], emptyIndexIndex, swapWith);
      yield new Iteration(nextState, this, swapWith);
    }
  }
  get availableMovements() {
    return this.computeAvailableMovements();
  }

  get path() {
    const path = [];
    for (let current = this; current.previous; current = current.previous!)
      path.unshift(current.action!);
    return path;
  }

  get misplacedCount() {
    return misplaced(this.state);
  }

  toString() {
    return this.state.toString();
  }
}

export function solve(initialState: number[]): number[] | null {
  const queue: TinyQueue<Iteration> = new TinyQueue(
    [new Iteration(initialState)],
    (a, b) => a.score - b.score,
  );
  const visited = new Set<string>([queue.peek()!.toString()]);

  while (queue.length > 0) {
    const current = queue.pop()!;

    if (current.misplacedCount === 0) {
      return current.path;
    }

    for (const next of current.availableMovements) {
      if (!visited.has(next.toString())) {
        visited.add(next.toString());
        queue.push(next);
      }
    }
  }
  return null;
}

function countInversions(arr: number[]): number {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr.length - 1) continue; // Skip counting inversions for the blank slot

    const currentValue = arr[i];
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] === arr.length - 1) continue; // Skip counting inversions for the blank slot

      if (currentValue > arr[j]) {
        count++;
      }
    }
  }
  return count;
}
export function isSolvable(puzzle: number[]): boolean {
  const size = Math.sqrt(puzzle.length);
  const inversions = countInversions(puzzle);

  if (size % 2 === 1) {
    // Odd grid size
    return inversions % 2 === 0;
  } else {
    // Even grid size
    const blankRowFromBottom =
      size - Math.floor(puzzle.indexOf(puzzle.length - 1) / size);
    if (blankRowFromBottom % 2 === 0) {
      return inversions % 2 === 1;
    } else {
      return inversions % 2 === 0;
    }
  }
}
