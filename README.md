# Mars Rover



## Description

Mars Rover is an API that translates a set of commands that are sent from Earth to Mars rover in order to direct it's movement.

## Getting Started


* Navigate through the project folder in terminal and launch the code
* Install the required dependencies through the terminal
  
``` npm i ```


### Executing program

* Execute moveRover function inside the rover.js file with the desired commands
```
moveRover(commands) // legit commands is a combination of L, R, F or B letters in a string
```
* Execute getCommands function inside the rover.js file with the desired coordinates to be moved to
```
getCommands(x, y, direction) // x and y are integers and direction is a string of a heading which can be one of the following (NORTH, EAST, SOUTH, WEST)
```

* Run the following command in terminal after calling the function inside the rover.js file
```
npm start
```
## Tests

* Run the following command in the probject terminal to run the tests for each part of the task
```
npm test
```

# Functions Explanation

## handleMovementDecision
``` 
const handleMovementDecision = (nextPosition, coordinates) => {
  const isObstacle = checkForObstacle(nextPosition);
  return willRoverStop[isObstacle](nextPosition, coordinates);
};
```
handleMovementDecision is a function that takes the next position the rover should move to and the current coordinates as parameters and checks if the next position is an obstacle or not
* If there is no obstacle it will call the function in willRoverStop responsible for updating the coordinates
* If there is an obstacle it will call the function in willRoverStop responsible for notifying that there is an obstacle ahead and stops the rover from moving

## checkForObstacle
```
const checkForObstacle = (nextPosition) => {
  const isObstacle = obstacles.some(
    (obstacle) => obstacle.toString() === nextPosition.toString()
  );
  return isObstacle;
};
```
checkForObstacle is a function that takes the next position the rover should move to and checks if this position is one of the known obstacles or not and returns boolean

## willRoverStop
```
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
```
```
// Parameter value example
coordinates: {1, 2, 'NORTH'}
newPosition: [2, 5] where [0] is X and [1] is Y
```
willRoverStop is an object whose keys are called by the return value of checkForObstacle function
* The 'false' key is a function with the new position and coordinates as parameters that will be passed from the handleMovementDecision function, this function will move the rover to the new position
* The 'true' key is a function with coordinates as a parameter that will be passed from the handleMovementDecision function, this function will stop the rover at the current position and notify that there is an obstacle ahead and also report it's current coordinates

## getCommands
```
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
  return `${generatedCommands.join("")}${adjustedDirectionCommand}`;
};
```
* getCommands is a function that takes the desired coordinates and keeps calling the generateCommands function as long as the current coordinates are not equal to the desired coordinates
* It updates the copy of coordinates in order to generate the new command based on the updated direction while the coordinates are persistent
* After the x and y axis positions match the desired position, the adjustToDesiredDirection function is called in order to rotate the rover towards the desired direction
## generateCommands

```
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
```
generateCommands is a function that takes the desired positions and the current position and does the following 


1 - Checks if the desired x value is lower than the current x or not and same for the current and desired y value in order to rotate the rover to a direction that makes it reach its destination by going forward only  

2 - The x axis loop can update y axis in order to dodge an obstacle, that's why ySign is called inside the y axis loop in order to match the new y axis position  

3 - Updates the current y axis position until it matches the desired y axis position after the current x axis matches the desired x axis  

4 - It loops on each axis until it reaches the desired position  

4 - I) It rotates the rover to a direction that makes it move forward to reach it's desired destination and pushes the rotation commands to the generatedCommands array  

4 - II) If there is an obstacle upon moving forward it will call the dodgeObstacle function  

4 - III) If it's safe to move forward it will push 'F' command to the commandsArray array  

5 - It returns the commandsArray at the end to be accessed by the top function (getCommands)



## dodgeObstacles
```
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
```
```
// Paramter value example
initialCoordinates = {3, 5, 'WEST'}
commandsArray = string[] or []
```
* dodgeObstacles function whose arguments are the current coordinates and the commands array that the commands needed for dodging the obstacles will be pushed into
* Originally, this function is called when handleMovementDecision detects that the next position is an obstacle
* First it rotates the rover to the right and checks if there will be an obstacle on moving forward or not, if there is an obstacle it will return to the original direction and try rotating left and checks again
* If moving forward is safe in any of the left or right rotations it will return the rotation command along with the forward movement command and stops the function


# IMPORTANT NOTES
* The return values inside willRoverStop are useful for the getCommands function and not the moveRover
* It is enough to run the unit tests in order to test the application
* DO NOT run the unit tests while you're calling either main functions (getCommands, moveRover) inside script.js as they will interfere with the tests
* DO NOT run getCommands and moveRover together.
* All functions initialized after moveRover function concern the third part of the task



