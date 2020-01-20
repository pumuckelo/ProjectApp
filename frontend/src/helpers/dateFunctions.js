module.exports = {
  convertMongoDateToIsoDate: mongodate => {
    return new Date(+mongodate).toISOString().split("T")[0];
  },

  mockFunction: () => {}
};
