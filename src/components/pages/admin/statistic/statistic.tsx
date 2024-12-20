import { useEffect, useState } from "react";
import { getOrdersStatistics } from "./statistic-api";
import { 
    IOrdersStatisticInfo, 
    IProductCategoriesStatisticInfo, 
    ISelect 
} from "../../../../interfaces/interfaces";
import { getUsers } from "../../../../models/user/user-api";
import { useCategories } from "../../../../models/categories/use-categories";
import StatisticPageView from "./components/statistic-page-view/statistic-page-view";

export type IStatisticMode = "orders" | "payment-methods" | "product-categories";
export interface IDateSettings { dateFrom: string | null, dateTo: string | null }
export interface ISelectedFilter { courier: boolean, pickup: boolean, delivered: boolean, inTransit: boolean }
const DEFAULT_DATE_SETTINGS = { dateFrom: null, dateTo: null };

export default function StatisticPage() {

    const [selectedMode, setSelectedMode] = useState<IStatisticMode>("orders");
    const [ordersStatisticInfo, setOrdersStatisticInfo] = useState<IOrdersStatisticInfo>({} as IOrdersStatisticInfo);
    const [dateSettings, setDateSettings] = useState<IDateSettings>(DEFAULT_DATE_SETTINGS);
    const [usersDataForSelect, setUsersDataForSelect] = useState<ISelect[]>([]);
    const [selectedUserForStatistic, setSelectedUserForStatistic] = useState<number| null>(null);
    const [categoriesSalesStatistic, setCategoriesSalesStatistic] = useState<IProductCategoriesStatisticInfo>({});

    const {
        categories,
        handleFindCategory,
    } = useCategories();

    const handleChangeSelectedMode = (mode: IStatisticMode) => {
        setSelectedMode(mode);
    };

    const handleUpdateDateSettings = (newDateSettings: IDateSettings) => {
        setDateSettings(newDateSettings);
    };

    const handleUpdateSelectedUserForStatistic = (selectedUser: ISelect | null) => {
        if (selectedUser) {
            setSelectedUserForStatistic(Number(selectedUser.id));
        } else {
            setSelectedUserForStatistic(null);
        }
    };

    const handleGetsSalesStatisticByCategories = (ordersStatisticInfo: IOrdersStatisticInfo) => {
        const categoryStats: IProductCategoriesStatisticInfo = {};
        Object.values(ordersStatisticInfo?.productsStats).forEach(productInfo => {
            
            productInfo.categories.forEach(categoryId => {
                const findedCategory = handleFindCategory(categoryId, categories);
                if (findedCategory?.id) {
                    if (categoryStats[findedCategory.title]) {
                        categoryStats[findedCategory.title] = {
                            amountOfOrders: categoryStats[findedCategory.title].amountOfOrders + productInfo.amount,
                            countOfOrders: categoryStats[findedCategory.title].countOfOrders + productInfo.count,
                            categoryId: findedCategory.id,
                            image: findedCategory.image
                        };
                    } else if (productInfo.count !== 0) {
                        categoryStats[findedCategory.title] = {
                            amountOfOrders: productInfo.amount,
                            countOfOrders: productInfo.count,
                            categoryId: findedCategory.id,
                            image: findedCategory.image
                        };
                    }
                }
            });
        });
        return categoryStats;
    };

    useEffect(() => {
        getOrdersStatistics(dateSettings.dateFrom, dateSettings.dateTo, selectedUserForStatistic)
            .then(({ data }) => {
                if (data.statistic) {
                    setOrdersStatisticInfo(data.statistic);
                }
            });
    }, [dateSettings, selectedUserForStatistic]);

    useEffect(() => {
        if (ordersStatisticInfo?.productsStats) {
            const categoriesSalesStatistic = handleGetsSalesStatisticByCategories(ordersStatisticInfo);
            setCategoriesSalesStatistic(categoriesSalesStatistic);
        }
    }, [ordersStatisticInfo]);

    useEffect(() => {
        getUsers()
            .then(({ data }) => {
                if (data.users) {
                    setUsersDataForSelect(data.users.map(el => {
                        return { id: el.id, label: el.login };
                    }));
                }
            });
    }, []);

    return (
        <StatisticPageView
            selectedMode={ selectedMode }
            ordersStatisticInfo={ ordersStatisticInfo }
            dateSettings={ dateSettings }
            usersDataForSelect={ usersDataForSelect }
            categoriesSalesStatistic={ categoriesSalesStatistic }
            handleChangeSelectedMode={ handleChangeSelectedMode }
            handleUpdateDateSettings={ handleUpdateDateSettings }
            handleUpdateSelectedUserForStatistic={ handleUpdateSelectedUserForStatistic }
        />
    );
}