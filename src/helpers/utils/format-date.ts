const formatDate = (isoString: string) => {
    const date = new Date(isoString);

    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).replace(',', '');
};

export default formatDate;
