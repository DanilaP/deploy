export const transformDateToString = (date: number) => {
    const result = new Date(date);
    const month = result.getMonth() + 1; 
    const day = result.getDate(); 
    const hours = result.getHours();
    const minutes = result.getMinutes();
    
    return `${result.getFullYear()}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};