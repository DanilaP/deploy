import { IOrdersStatisticInfo } from "../../../../../../interfaces/interfaces";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';
import { useTranslation } from "react-i18next";
import "./payments-statistic-view.scss";
import { PaymentsChartTooltip } from "../payments-chart-tooltip/payments-chart-tooltip";

interface IPaymentsStatisticViewProps {
    ordersStatisticInfo: IOrdersStatisticInfo
}

export default function PaymentsStatisticView({
    ordersStatisticInfo
}: IPaymentsStatisticViewProps) {

    const { t } = useTranslation();

    const data = Object.values(ordersStatisticInfo.paymentsInfo).map(el => {
        return {
            name: `${t(`text.checkout.paymentMethods.${el.type}`)}`,
            uv: el.count,
            pv: el.amount,
            amount: el.amount,
        };
    });

    return (
        <div className="payment-methods-statistic">
            <ResponsiveContainer 
                className="payment-methods-chart-container"
                width="40%"
                height={ 325 }
            >
                <BarChart data={ data }>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                        content={ <PaymentsChartTooltip /> } 
                        cursor={ { fill: "var(--hover-color)" } } 
                    />
                    <Legend />
                    <Bar dataKey="amount" barSize={ 20 } fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            <div className="payments-methods-more-info">
                <div className="payment-methods-info">
                    {
                        data.map(info => {
                            const methodPercent = 
                                (info.amount / ordersStatisticInfo.amountPriceOfOrders * 100).toFixed(2);
                            return (
                                <div key={ info.name } className="block">
                                    <div className="name">
                                        { info.name } ({ `${methodPercent}%` })
                                    </div>
                                    <div className="value">
                                        { t("text.amountOfPayments") }: { info.amount } { t('text.rub') }
                                    </div>
                                    <div className="description">
                                        { t("text.transactionCount") }: { info.uv }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="payment-methods-common">
                    <div className="block">
                        <div className="name">{ t("text.generalInfo") }</div>
                        <div className="value">
                            <span>{ t("text.totalSalesAmount") }: </span>
                            <span className="total-value">
                                { ordersStatisticInfo.amountPriceOfOrders } { t('text.rub') }
                            </span>
                        </div>
                        <div className="value">
                            <span>{ t("text.successOperationCount") }: </span>
                            <span className="total-value">
                                { ordersStatisticInfo.countOfOrders } { t('text.pcs') }
                            </span>
                        </div>
                        <div className="value">
                            <span>{ t("statistic.averageAmountOfOrder") }: </span>
                            <span className="total-value">
                                { ordersStatisticInfo.averageAmountOfOrder } { t('text.rub') }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}