export const transformDateToString = (date: number) => {
    const result = new Date(date);
    const month = result.getMonth() + 1; 
    const day = result.getDate(); 
    const hours = result.getHours();
    const minutes = result.getMinutes();
    
    return `${result.getFullYear()}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
export const isDateWithin15Minutes = (date: string) => {
    const currentDate = new Date(Date.now());
    const paramDate = new Date(date);
    const diff = Math.abs(currentDate - paramDate);
    return diff < 900000;
};