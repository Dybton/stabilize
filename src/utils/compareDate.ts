export const compareDates = (date1: number | Date, date2: number | Date): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Reset time to 0 for both dates to compare only the date part
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    const diff = d1.getTime() - d2.getTime();
    const sign = Math.sign(diff);
    const daysDifference = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));

    return sign * daysDifference;
};