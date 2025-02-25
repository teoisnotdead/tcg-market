export const toFormatDate = (date) => {
  const dateObj = new Date(date);
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return dateObj.toLocaleDateString("es-CL", options);
};