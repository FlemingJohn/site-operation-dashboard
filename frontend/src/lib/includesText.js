export const includesText = (values, search) => {
  if (!search) return true;
  const needle = search.toLowerCase();
  return values.some((value) =>
    String(value ?? '')
      .toLowerCase()
      .includes(needle)
  );
};
