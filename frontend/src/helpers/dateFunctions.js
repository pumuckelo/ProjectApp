export const convertMongoDateToIsoDate = mongodate => {
  return new Date(+mongodate).toISOString().split("T")[0];
};

export const convertIsoStringToLocalDateString = isoString => {
  return new Date(isoString).toLocaleDateString();
};
