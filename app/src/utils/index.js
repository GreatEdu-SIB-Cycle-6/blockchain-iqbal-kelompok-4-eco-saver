export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};
  
export const daysLeft = (deadline) => {
  const now = new Date().getTime();
  const deadlineTime = new Date(deadline).getTime();
  const difference = deadlineTime - now;

  if (difference <= 0) {
    return "0";
  }
  const remainingDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
  return remainingDays.toString();
};

export const checkIfImage = (url, callback) => {
  if (url.startsWith('ipfs://')) {
    url = 'https://ipfs.io/ipfs/' + url.substring('ipfs://'.length);
  }

  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

