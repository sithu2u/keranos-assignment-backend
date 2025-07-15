export const validateRequest = (schema, data) => {
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};
