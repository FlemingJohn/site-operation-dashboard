export const addDays = (date, days) => {
  const result = new Date(`${date}T00:00:00`);
  result.setDate(result.getDate() + days);
  return result.toLocaleDateString('en-CA');
};
