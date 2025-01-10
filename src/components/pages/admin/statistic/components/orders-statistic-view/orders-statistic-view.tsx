import { useTranslation } from "react-i18next";
import { IOrdersStatisticInfo } from "../../../../../../interfaces/interfaces";
import { FaTruckPickup } from "react-icons/fa6";
import { GiCardPickup } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { GrInProgress } from "react-icons/gr";
import { FaShoppingBasket } from "react-icons/fa";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import { IoMdTimer } from "react-icons/io";
import "./orders-statistic-view.scss";

interface IOrdersStatisticViewProps {
    ordersStatisticInfo: IOrdersStatisticInfo,
}

type ColumnType = GridColDef<{
    id: number;
    images: string[];
    amount: number;
    count: number;
    name: string;
}>;

export default function OrdersStatisticView({
    ordersStatisticInfo
}: IOrdersStatisticViewProps) {

    const { t } = useTranslation();

    const columns: readonly ColumnType[] = [
        { field: "images", headerName: t("text.image"), minWidth: 150, headerAlign: "center", resizable: false },
        { field: "name", headerName: t("text.product"), flex: 1, headerAlign: "center", resizable: false },
        { field: "amount", headerName: t("text.amount"), flex: 1, headerAlign: "center", resizable: false },
        { field: "count", headerName: t("text.quantity"), flex: 1, headerAlign: "center", resizable: false },
        { field: "ordersCount", headerName: t("statistic.countOfOrders"), flex: 1, headerAlign: "center", resizable: false },
    ];
    const rows = ordersStatisticInfo?.productsStats
        ? Object.values(ordersStatisticInfo?.productsStats)?.map((el, index) => {
            return {
                id: index,
                images: el.images,
                amount: `${el.amount} ${t("text.rub")}` ,
                count: `${el.count} ${t("text.pcs")}`,
                name: el.name,
                ordersCount: `${el.ordersCount} ${t("text.pcs")}`
            };
        })
        : [];

    return (
        <div className="orders-statistic-view">
            <div className="orders-statistic-main">
                <div className="block">
                    <div className="title">
                        { t("statistic.countOfOrders") }
                    </div>
                    <FaShoppingBasket className="common-icon" />
                    <div className="value">
                        { ordersStatisticInfo.countOfOrders } { t("text.pcs") }
                    </div>
                </div>
                <div className="block">
                    <div className="title">
                        { t("statistic.averageTimeOfDelivery") }
                    </div>
                    <IoMdTimer className="common-icon" />
                    <div className="value">
                        { ordersStatisticInfo.averageTimeOfDeliveryHours } { t("text.hours") }
                    </div>
                </div>
                <div className="block">
                    <div className="title">
                        { t("statistic.countOfCourierOrders") }
                    </div>
                    <FaTruckPickup className="common-icon" />
                    <div className="value">
                        { ordersStatisticInfo.courierCount } { t("text.pcs") }
                    </div>
                </div>
                <div className="block">
                    <div className="title">
                        { t("statistic.pickupCountOfOrders") }
                    </div>
                    <GiCardPickup className="common-icon" />
                    <div className="value">
                        { ordersStatisticInfo.pickupCount } { t("text.pcs") }
                    </div>
                </div>
                <div className="block">
                    <div className="title">
                        { t("statistic.deliveredCount") }
                    </div>
                    <TbTruckDelivery className="common-icon" />
                    <div className="value">
                        { ordersStatisticInfo.deliveredCount } { t("text.pcs") }
                    </div>
                </div>
                <div className="block">
                    <div className="title">
                        { t("statistic.inTransitCount") }
                    </div>
                    <GrInProgress className="common-icon" />
                    <div className="value">
                        { ordersStatisticInfo.inTransitCount } { t("text.pcs") }
                    </div>
                </div>
            </div>
            <DataGrid   
                className="products-data-table"
                rows={ rows }
                disableColumnFilter
                columns={ columns.map((columnData: ColumnType) => {
                    if (columnData.field === "images") {
                        return {
                            ...columnData,
                            renderCell: (params) => {
                                return (
                                    <div className="product-photo-column">
                                        <img 
                                            src={ params.value[0] } 
                                            className="product-photo" 
                                        />
                                    </div>
                                );
                            }
                        };
                    }
                    return columnData;
                }) }
                pageSizeOptions={ [6] }
                initialState={ {
                    pagination: {
                            paginationModel: {
                            pageSize: 6,
                        },
                    },
                } }
                disableRowSelectionOnClick
                localeText={ ruRU.components.MuiDataGrid.defaultProps.localeText }
            />
        </div>
    );
}