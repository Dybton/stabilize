export const formatTime = (time: number): string => {
  const date = new Date(time);

  const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false,
      timeZone: 'Europe/Copenhagen',
  });
  return formattedTime;
};

