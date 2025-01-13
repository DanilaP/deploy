export const getDifferenceBetweenDates = (
    firstDate: string | number, 
    secondDate: string | number
) => {
    const fDate = new Date(firstDate);
    const sDate = new Date(secondDate);
    const difference = fDate.getTime() - sDate.getTime();

    return {
        millis: difference,
        hours: (difference / 3600000).toFixed(2)
    };
};