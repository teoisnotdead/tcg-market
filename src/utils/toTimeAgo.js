export const toTimeAgo = (date) => {
  const timeAgo = new Date(date);
  const now = new Date();

  const seconds = Math.floor((now - timeAgo) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} segundos atrás`;
  } else if (minutes < 60) {
    return `${minutes} minutos atrás`;
  } else if (hours < 24) {
    return `${hours} horas atrás`;
  } else if (days < 7) {
    return `${days} días atrás`;
  } else {
    return `${timeAgo.getFullYear()}-${timeAgo.getMonth() + 1}-${timeAgo.getDate()}`;
  }
};