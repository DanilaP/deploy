import { useTranslation } from "react-i18next";
import { IDateSettings, IStatisticMode } from "../../statistic";
import { IOrdersStatisticInfo, IProductCategoriesStatisticInfo, ISelect } from "../../../../../../interfaces/interfaces";
import { Autocomplete, TextField } from "@mui/material";
import OrdersStatisticView from "../orders-statistic-view/orders-statistic-view";
import PaymentsStatisticView from "../payments-statistic-view/payments-statistic-view";
import ProductCategoriesSalesStatisticView from "../product-categories-statistic-view/product-categories-statistic-view";
import "./statistic-page-view.scss";

interface IStatisticPageViewProps {
    selectedMode: IStatisticMode,
    ordersStatisticInfo: IOrdersStatisticInfo,
    dateSettings: IDateSettings,
    usersDataForSelect: ISelect[],
    categoriesSalesStatistic: IProductCategoriesStatisticInfo,
    handleChangeSelectedMode: (mode: IStatisticMode) => void,
    handleUpdateDateSettings: (newDateSettings: IDateSettings) => void
    handleUpdateSelectedUserForStatistic: (selectedUser: ISelect | null) => void
}

export default function StatisticPageView({
    selectedMode,
    ordersStatisticInfo,
    dateSettings,
    usersDataForSelect,
    categoriesSalesStatistic,
    handleChangeSelectedMode,
    handleUpdateDateSettings,
    handleUpdateSelectedUserForStatistic
}: IStatisticPageViewProps) {
    
    const { t } = useTranslation();

    const handleGetCurrentStatisticView = () => {
        if (selectedMode === "orders") {
            return <OrdersStatisticView ordersStatisticInfo={ ordersStatisticInfo } />;
        }
        if (selectedMode === "payment-methods") {
            return <PaymentsStatisticView ordersStatisticInfo={ ordersStatisticInfo } />;
        }
        if (selectedMode === "product-categories") {
            return <ProductCategoriesSalesStatisticView productCategoriesStatistic={ categoriesSalesStatistic } />;
        }
    };

    return (
        <div className="statistic-page-view" id="testpdf">
            <div className="statistic-page-title">
                <div className="date-settings">
                    <span>{ t("text.from") }</span> 
                    <TextField 
                        type="date"
                        onChange={ (e) => {
                            handleUpdateDateSettings({ ...dateSettings, dateFrom: e.target.value });
                        } }
                    /> 
                    <span>{ t("text.to") }</span> 
                    <TextField 
                        type="date"
                        onChange={ (e) => {
                            handleUpdateDateSettings({ ...dateSettings, dateTo: e.target.value });
                        } }
                    />
                </div>
                <div className="user-selection">
                    <Autocomplete
                        options={ usersDataForSelect }
                        onChange={ (_, value) => handleUpdateSelectedUserForStatistic(value) }
                        renderInput={ (params) => (
                            <TextField
                                placeholder={ t("text.searchUser") }
                                { ...params }
                                id="select-user-for-statistic"
                            />
                        ) }
                    />
                </div>
            </div>
            <div className="statistic-page-types">
                <div 
                    className={ selectedMode === "orders" ? "selected-statistic-type" : "statistic-type" }
                    onClick={ () => handleChangeSelectedMode("orders") }
                >
                    { t("text.statisticProducts") }
                </div>
                <div 
                    className={ selectedMode === "payment-methods" ? "selected-statistic-type" : "statistic-type" }
                    onClick={ () => handleChangeSelectedMode("payment-methods") }
                >
                    { t("text.statisticPaymentsMethods") }
                </div>
                <div 
                    className={ selectedMode === "product-categories" ? "selected-statistic-type" : "statistic-type" }
                    onClick={ () => handleChangeSelectedMode("product-categories") }
                >
                    { t("statistic.productCategoriesStatistic") }
                </div>
            </div>
            <div className="statistic-page-current-data">
                {
                    handleGetCurrentStatisticView()
                }
            </div>
        </div>
    );
}