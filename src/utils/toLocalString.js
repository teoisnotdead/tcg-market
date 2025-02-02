export const toLocalString = (number) => {
  return number.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
  })
}