export const formatTime = (time: number): string => {
    const date = new Date(time);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  };