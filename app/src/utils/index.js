// export const daysLeft = (deadline) => {
//     const difference = new Date(deadline).getTime() - Date.now();
//     const remainingDays = difference / (1000 * 3600 * 24);

//     return remainingDays.toFixed(0);
//   };
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
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};
