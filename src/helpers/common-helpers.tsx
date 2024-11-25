const statusColors: { [key: string]: "warning" | "success" | "info" | "error" | "default" } = {
    waiting: "warning",
    delivered: "success",
    "in-transit": "info",
    cancelled: "error",
    default: "default",
};

export const getStatusColor = (status: string) => statusColors[status] || statusColors.default;

export const formatDate = (isoString: string) => {
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

