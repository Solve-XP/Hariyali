export function validateRequired(
  data,
  fields
) {

  return fields.every(
    (field) => !!data[field]
  );
}