import "./product-categories-chart-tooltip.scss";

export const CustomChartTooltip = (
    { active, payload, label }: 
    { payload: any[], label: string, active: boolean }
) => {

    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{ `${payload[0].value}` }</p>
                <p className="intro">{ label }</p>
            </div>
        );
    }  
    return null;
};