export const extractValidationErrors = (error) => {
  const details = error.details.map((err) => ({
    key: err.path.join("."),
    message: err.message,
  }));
  return details;
};
