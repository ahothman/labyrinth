const { EMPTY, FILLED } = require("../config");

const toKey = (y, x) => `${y}-${x}`;

// Using breadth first algorithm to find the path.
const findPath = function (labyrinth) {
  const { start, end, grid, rows, columns } = labyrinth;
  const q = [];
  q.push([start.y, start.x]);
  const path = new Map();
  const visited = new Set();
  while (q.length > 0) {
    const [y, x] = q.shift();
    // move upwards
    if (y > 0 && grid[y - 1][x] != FILLED && !visited.has(toKey(y - 1, x))) {
      path.set(toKey(y - 1, x), [y, x]);
      visited.add(toKey(y - 1, x));
      q.push([y - 1, x]);
    }
    // move downwards.
    if (
      y < rows - 1 &&
      grid[y + 1][x] != FILLED &&
      !visited.has(toKey(y + 1, x))
    ) {
      path.set(toKey(y + 1, x), [y, x]);
      visited.add(toKey(y + 1, x));
      q.push([y + 1, x]);
    }
    // move right.
    if (x > 0 && grid[y][x - 1] != FILLED && !visited.has(toKey(y, x - 1))) {
      path.set(toKey(y, x - 1), [y, x]);
      visited.add(toKey(y, x - 1));
      q.push([y, x - 1]);
    }
    // move left.
    if (
      x < columns - 1 &&
      grid[y][x + 1] != FILLED &&
      !visited.has(toKey(y, x + 1))
    ) {
      path.set(toKey(y, x + 1), [y, x]);
      visited.add(toKey(y, x + 1));
      q.push([y, x + 1]);
    }
    if (y == end.y && x == end.x) break;
  }

  return path;
};

const getDirectionsFromPath = (start, end, path) => {
  let currentCoordinates = {
    y: end.y,
    x: end.x,
  };
  let key = toKey(currentCoordinates.y, currentCoordinates.x);
  let startKey = toKey(start.y, start.x);
  const directions = [];
  while (path.has(key) && key != startKey) {
    const [y, x] = path.get(key);
    if (y > currentCoordinates.y) directions.unshift("up");
    else if (y < currentCoordinates.y) directions.unshift("down");
    else if (x > currentCoordinates.x) directions.unshift("left");
    else if (x < currentCoordinates.x) directions.unshift("right");
    currentCoordinates = {
      y,
      x,
    };
    key = toKey(currentCoordinates.y, currentCoordinates.x);
  }
  return directions;
};

const solve = (labyrinth) => {
  const path = findPath(labyrinth);
  const directions = getDirectionsFromPath(
    labyrinth.start,
    labyrinth.end,
    path
  );
  return directions;
};

const createEmptyLabyrinth = (columns = 6, rows = 6) => {
  const grid = new Array(rows);
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(columns);
    for (let j = 0; j < columns; j++) {
      grid[i][j] = EMPTY;
    }
  }
  return {
    start: { y: 0, x: 0 },
    end: { y: rows - 1, x: columns - 1 },
    columns,
    rows,
    grid,
  };
};

module.exports = {
  createEmptyLabyrinth,
  solve,
};
