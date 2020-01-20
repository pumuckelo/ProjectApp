const { convertMongoDateToIsoDate, mockFunction } = require("./dateFunctions");

test("should output date as isodatestring", () => {
  const datestring = convertMongoDateToIsoDate("1579132800000");

  expect(datestring).toBe("2020-01-16");
});

const add = jest.fn(() => 3);

const multiplyTotal = (taxes, subtotal, factor) => {
  let total = add(taxes, subtotal);
  return total * factor;
};
