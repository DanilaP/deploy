import { IProductCategoriesStatisticInfo } from "../../../../../../interfaces/interfaces";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Brush,
    ResponsiveContainer,
} from 'recharts';
import { useTranslation } from "react-i18next";
import { CustomChartTooltip } from "../product-categories-chart-tooltip/product-categories-chart-tooltip";
import "./product-categories-statistic-view.scss";

interface IProductCategoriesSalesStatisticViewProps {
    productCategoriesStatistic: IProductCategoriesStatisticInfo
}

export default function ProductCategoriesSalesStatisticView({
    productCategoriesStatistic
}: IProductCategoriesSalesStatisticViewProps) {

    const { t } = useTranslation();

    const emptyDataObj = {
        name: "",
        amount: 0,
        count: 0
    };
    const data = [
        ...Object.keys(productCategoriesStatistic)
            .map(categoryName => {
                return {
                    name: categoryName,
                    amount: productCategoriesStatistic[categoryName].amountOfOrders,
                    count: productCategoriesStatistic[categoryName].countOfOrders
                };
            })
            .sort((prev, current) => {
                if (prev.amount < current.amount) return -1;
                return 1;
            }),
        emptyDataObj
    ];


    return (
        <div className="product-categories-statistic-view">
            <div className="product-categories-graphic-data">
                <div className="product-categories-amount-sales">
                    <div className="stats-title">
                        Топ-5 самых продаваемых категорий товаров по сумме продаж
                    </div>
                    <ResponsiveContainer 
                        className="chart-block"
                        width="100%" 
                    >
                        <LineChart
                            data={ data }
                            syncId="anyId"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                                content={ <CustomChartTooltip /> } 
                                cursor={ { fill: "var(--hover-color)" } }  
                            />
                            <Line 
                                type="monotone" 
                                dataKey="amount" 
                                stroke="#8884d8" 
                                fill="#8884d8" 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="product-categories-count-sales">
                    <div className="stats-title">
                        Топ-5 самых продаваемых категорий товаров по количеству продаж
                    </div>
                    <ResponsiveContainer
                        className="chart-block"
                        width="100%"
                    >
                        <LineChart
                            data={ data }
                            syncId="anyId"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                                content={ <CustomChartTooltip /> } 
                                cursor={ { fill: "var(--hover-color)" } }  
                            />
                            <Line 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#82ca9d"
                                fill="#82ca9d" 
                            />
                            <Brush />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="product-categories-list-data">
                <div className="stats-title">
                    Список категорий в которых есть продажи
                </div>
                <div className="product-categories-list-content">
                    {
                        Object.keys(productCategoriesStatistic).map(categoryName => {
                            const categoryData = productCategoriesStatistic[categoryName];
                            return (
                                <div className="category-list-item" key={ categoryData.categoryId }>
                                    <div className="category-image-wrapper">
                                        <img
                                            className="category-image"
                                            src={ categoryData.image } 
                                        />
                                        <div className="category-title">{ categoryName }</div>
                                    </div>
                                   
                                    <div className="category-sales-data">
                                        <div className="amount-of-sales">
                                            { t("statistic.countOfOrders") } { categoryData.countOfOrders }
                                        </div>
                                        <div className="count-of-sales">
                                            { t("text.amount") } { categoryData.amountOfOrders }
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}