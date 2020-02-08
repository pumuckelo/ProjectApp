module.exports = {
  generateRandomId: string => {
    let part = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    return (
      part() +
      part() +
      "-" +
      part() +
      string +
      "-" +
      part() +
      "-" +
      part() +
      part() +
      "-" +
      part()
    );
  }
};
