export const getGlucoseDataForPeriod = (glucoseData, startTime, endTime) => {
    const filteredData = glucoseData.filter((data) => {
      return data.x >= startTime && data.x <= endTime;
    });
    return filteredData;
}