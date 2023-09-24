const headings = {
  0: "NORTH",
  90: "EAST",
  180: "SOUTH",
  270: "WEST",
};
const coordinates = {
  x: 1,
  y: 6,
  direction: headings["90"],
};
const obstacles = [
  [1, 4],
  [3, 6],
  [7, 4],
  [4, 7],
  [4, 9],
  [5, 13],
];

const willRoverStop = {
  true: (coordinates) => {
    console.log("Tackled an obstacle!", coordinates);
    return true;
  },
  false: (newPosition, coordinates) => {
    coordinates["x"] = newPosition[0];
    coordinates["y"] = newPosition[1];
    return false;
  },
};
const isObstacleUpfront = (nextPosition) => {
  const isObstacle = obstacles.some(
    (obstacle) => obstacle.toString() === nextPosition.toString()
  );
  return isObstacle;
};
const handleMovementDecision = (nextPosition, coordinates) => {
  const isObstacle = isObstacleUpfront(nextPosition);
  const targetDecisionFn = willRoverStop[isObstacle];
  return targetDecisionFn(nextPosition, coordinates);
};

const getDegree = (direction) => {
  const currentDegree = Object.keys(headings).find(
    (key) => headings[key] === direction
  );
  return currentDegree;
};

const moveForward = (coordinates) => {
  const possibilities = {
    0: () => [coordinates.x, coordinates.y + 1],
    90: () => [coordinates.x + 1, coordinates.y],
    180: () => [coordinates.x, coordinates.y - 1],
    270: () => [coordinates.x - 1, coordinates.y],
  };
  const currentDegree = getDegree(coordinates.direction);

  const nextPosition = possibilities[currentDegree]();
  return handleMovementDecision(nextPosition, coordinates);
};

const moveBackwards = (coordinates) => {
  const possibilities = {
    0: () => [coordinates.x, coordinates.y - 1],
    90: () => [coordinates.x - 1, coordinates.y],
    180: () => [coordinates.x, coordinates.y + 1],
    270: () => [coordinates.x + 1, coordinates.y],
  };
  const currentDegree = getDegree(coordinates.direction);
  const nextPosition = possibilities[currentDegree]();
  handleMovementDecision(nextPosition, coordinates);
};

const rotateRight = (coordinates) => {
  const currentDegree = getDegree(coordinates.direction);
  let targetDegree;
  parseInt(currentDegree) === 270
    ? (targetDegree = 0)
    : (targetDegree = parseInt(currentDegree) + 90);

  coordinates.direction = headings[targetDegree];
};
const rotateLeft = (coordinates) => {
  const currentDegree = getDegree(coordinates.direction);

  let targetDegree;
  parseInt(currentDegree) === 0
    ? (targetDegree = 270)
    : (targetDegree = parseInt(currentDegree) - 90);
  coordinates.direction = headings[targetDegree];
};

const commandFunctions = {
  F: () => moveForward(coordinates),
  B: () => moveBackwards(coordinates),
  R: () => rotateRight(coordinates),
  L: () => rotateLeft(coordinates),
};
const moveRover = (command) => {
  const commandsArray = command.split("");
  for (let i = 0; i <= commandsArray.length - 1; i++) {
    if (
      commandFunctions[commandsArray[i]](coordinates) === true &&
      commandsArray[i + 1] === "F"
    )
      break;
  }
  console.log(coordinates);
  return coordinates;
};

const shouldShiftTo = {
  x: {
    "-1": "WEST",
    1: "EAST",
  },
  y: {
    "-1": "SOUTH",
    1: "NORTH",
  },
};
const handleRotation = (axis, axisSign, commandsArray, initialCoordinates) => {
  if (
    initialCoordinates.direction !== shouldShiftTo[`${axis}`][`${axisSign}`]
  ) {
    rotateRight(initialCoordinates);
    commandsArray.push("R");
    handleRotation(axis, axisSign, commandsArray, initialCoordinates);
  }
};

const dodgeObstacles = (initialCoordinates, commandsArray) => {
  rotateRight(initialCoordinates);
  if (!moveForward(initialCoordinates)) {
    return commandsArray.push("RF");
  } else {
    rotateLeft(initialCoordinates);
    rotateLeft(initialCoordinates);
    !moveForward(initialCoordinates) && commandsArray.push("LF");
    return;
  }
};

const adjustToDesiredDirection = (currCoordinates, desiredDirection) => {
  const currentAngle = getDegree(currCoordinates.direction);
  const desiredAngle = getDegree(desiredDirection);
  const angleDifference = currentAngle - desiredAngle;
  const rotationsUponDegree = {
    "-90": "R",
    90: "L",
    "-270": "L",
    270: "R",
    0: " ",
  };
  return rotationsUponDegree[angleDifference] || "RR";
};
const getCommands = (x, y, direction) => {
  const generatedCommands = [];
  const initialCoordinates = { ...coordinates };
  if (isObstacleUpfront([x, y])) {
    throw new Error(
      "The entered coordinate is an obstacle, please try another"
    );
  }
  while (x !== initialCoordinates.x || y !== initialCoordinates.y) {
    const newCommands = generateCommands(x, y, initialCoordinates);
    generatedCommands.push(...newCommands);
  }
  const adjustedDirectionCommand = adjustToDesiredDirection(
    initialCoordinates,
    direction
  );
  console.log(`${generatedCommands.join("")}${adjustedDirectionCommand}`);
  return `${generatedCommands.join("")}${adjustedDirectionCommand}`;
};

const generateCommands = (x, y, initialCoordinates) => {
  const xSign =
    Math.sign(x - initialCoordinates.x) === 0
      ? 1
      : Math.sign(x - initialCoordinates.x);
  const commandsArray = [];
  while (initialCoordinates.x !== x) {
    handleRotation("x", xSign, commandsArray, initialCoordinates);
    moveForward(initialCoordinates)
      ? dodgeObstacles(
          initialCoordinates,

          commandsArray
        )
      : commandsArray.push("F");
  }

  while (initialCoordinates.y !== y) {
    const ySign =
      Math.sign(y - initialCoordinates.y) === 0
        ? 1
        : Math.sign(y - initialCoordinates.y);
    handleRotation("y", ySign, commandsArray, initialCoordinates);
    moveForward(initialCoordinates)
      ? dodgeObstacles(
          initialCoordinates,

          commandsArray
        )
      : commandsArray.push("F");
  }
  return commandsArray;
};

// moveRover('FFFFF')
// getCommands(4, 6, 'WEST')
module.exports = {
  getCommands,
  moveRover,
};
