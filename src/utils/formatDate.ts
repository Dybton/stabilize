export const formatDate = (time: number | Date): string => {
    const date = new Date(time);
  
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric'
    });
    return formattedDate;
};