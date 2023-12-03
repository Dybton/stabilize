
import dummyGlucoseData from "./DummyData2";

const glucoseData = [
    {
      "x": 1679788800000,
      "y": 9
    },
    {
      "x": 1679961600000,
      "y": 8
    },
    {
      "x": 1679976000000,
      "y": 9
    },
    {
      "x": 1681593600000,
      "y": 2
    },
    {
      "x": 1681766400000,
      "y": 6
    },
    {
      "x": 1681780800000,
      "y": 7
    },
    {
      "x": 1681953600000,
      "y": 3
    }
]

function generateTimestamps(date1, date2) {
    const diff = date2.getTime() - date1.getTime();
    const step = diff / 19; // We divide by 19 to get 20 steps between the two dates
    const timestamps = [];
  
    for (let i = 0; i < 20; i++) {
      const newDate = new Date(date1.getTime() + step * i);
      const randomNumber = Math.floor(Math.random() * 11) + 1; // Generate a random number between 1 and 11
      timestamps.push({x: newDate.getTime(), y: randomNumber});
    }
  
    return timestamps;
}
const now = new Date();
const twelveHoursBack = new Date(now.getTime() - 12 * 60 * 60 * 1000); // Add 12 hours in millisecond
const hours24Back = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Add 24 hours in millisecond

const timestamps = generateTimestamps(twelveHoursBack, now);


  
export default timestamps