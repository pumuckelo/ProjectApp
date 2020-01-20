module.exports = {
  convertMongoDateToIsoDate: mongodate => {
    return new Date(+mongodate).toISOString().split("T")[0];
  },
  convertIsoStringToLocalDateString: isoString => {
    return new Date(isoString).toLocaleDateString();
  },

  mockFunction: () => {}
};
