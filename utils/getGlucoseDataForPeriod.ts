import { GlucoseData } from "../Types";

export const getGlucoseDataForPeriod = (glucoseData: GlucoseData, startTime : Date, endTime : Date) : GlucoseData => {
    const filteredData = glucoseData.filter((data) => {

      const startTimestamp = startTime.getTime();
      const endTimestamp = endTime.getTime();

      return data.x >= startTimestamp && data.x <= endTimestamp;
    });
    return filteredData;
}