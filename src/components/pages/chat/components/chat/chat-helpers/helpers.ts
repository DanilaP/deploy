export const transformDateToString = (date: number) => {
    const result = new Date(date);
    const month = result.getMonth() + 1; 
    const day = result.getDate(); 
    const hours = result.getHours();
    const minutes = result.getMinutes();
    
    return `${result.getFullYear()}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
export const isDateWithin15Minutes = (date: string) => {
    const formatedDate = new Date(date.replace(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})/, '$1-$2-$3T$4:$5:00'));
    const currentDate = new Date();
    const differenceInMillis = Math.abs(formatedDate - currentDate);
    const fifteenMinutesInMillis = 15 * 60 * 1000;
    return differenceInMillis <= fifteenMinutesInMillis;
};