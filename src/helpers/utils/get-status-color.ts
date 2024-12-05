const statusColors: { [key: string]: "warning" | "success" | "info" | "error" | "default" } = {
    waiting: "warning",
    delivered: "success",
    "in-transit": "info",
    cancelled: "error",
    default: "default",
};

export const getStatusColor = (status: string) => statusColors[status] || statusColors.default;

