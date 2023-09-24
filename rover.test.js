const { getCommands, moveRover } = require("./rover");

test("generated command should move the rover safely to the desired position", () => {
  const returnedString = getCommands(4, 15, "NORTH");
  expect(returnedString).toBe("FRFRRRFFRRRFRFRRRFFFFFFRFRRRFFFRRRFFR");
});

test('Rover should stop before obstacle', () => {
  const stoppedAt = moveRover('FFFFFF')
  expect(stoppedAt).toEqual({ x: 2, y: 6, direction: "EAST" });
})

test("Move rover should move to the correct position", () => {
  const returnedCoordinates = moveRover(
    "FRFRRRFFRRRFRFRRRFFFFFFRFRRRFFFRRRFFR"
  );
  expect(returnedCoordinates).toEqual({ x: 4, y: 15, direction: "NORTH" });
});

test('Entering the coordinates of an obstacle should throw an error', () => {
  expect(() => getCommands(1, 4, "SOUTH")).toThrow(
    "The entered coordinate is an obstacle, please try another"
  );
})


