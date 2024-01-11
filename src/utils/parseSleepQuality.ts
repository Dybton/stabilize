export const parseSleepQuality = (sleepQuality: number) => {
    let parsedSleepQuality = "";
    if (sleepQuality <= 1) {
      parsedSleepQuality = "Very Poor";
    } else if (sleepQuality <= 2) {
      parsedSleepQuality = "Poor";
    } else if (sleepQuality <= 3) {
      parsedSleepQuality = "Fair";
    } else if (sleepQuality <= 4) {
      parsedSleepQuality = "Good";
    } else if (sleepQuality <= 5) {
      parsedSleepQuality = "Excellent";
    }
    return parsedSleepQuality;
  };