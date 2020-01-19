const { convertMongoDateToIsoDate } = require("./dateFunctions");

test("should ", () => {});

test("should output date as isodatestring", () => {
  const datestring = convertMongoDateToIsoDate("1579132800000");

  expect(datestring).toBe("2020-01-16");
});
