export default (monthInput, yearInput) => {
  const month = monthInput === 12 ? 1 : monthInput + 1;
  const year = monthInput === 12 ? yearInput + 1 : yearInput;
  return { month, year };
};
