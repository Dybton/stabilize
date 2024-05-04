export const formatDate = (time: number | Date, showYear = true): string => {
    const date = new Date(time);
  
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit', 
        month: '2-digit'
    };
    if (showYear) {
        options.year = 'numeric';
    }

    const formattedDate = date.toLocaleDateString('en-GB', options);
    return formattedDate;
};