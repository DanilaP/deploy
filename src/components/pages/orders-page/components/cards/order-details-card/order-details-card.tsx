import { FC } from "react";
import {
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import {
    MdLocalShipping,
    MdPerson,
    MdStore,
} from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../../stores";
import './order-details-card.scss';
import IOrder from "../../../../../../models/order/order.ts";
import { getStatusColor } from "../../../../../../helpers/utils/get-status-color.ts";
import formatDate from "../../../../../../helpers/utils/format-date.ts";
import formatPhoneNumber from "../../../../../../helpers/utils/format-phone-number.ts";
import getFormattedAddressString from "../../../../../../helpers/utils/get-formatted-address-string.tsx";

const OrderDetailsCard:FC<{ order: IOrder }> = ({ order }) => {
    const { t } = useTranslation();
    const { userStore } = useStore();

    return (
        <Card className="order-data-card">
            <CardContent className="order-status-wrapper">
                <Typography className="order-number">
                    { t('breadcrumbs.order') } №{ order.orderNumber } { t('text.from') } { formatDate(order.createdAt) }
                </Typography>
                <div className="status-chip-wrapper">
                    <Chip
                        className="status-chip"
                        label={ t(`text.vendorsLogistic.shippingStatuses.${ order.orderStatus }`) }
                        color={ getStatusColor(order.orderStatus) }
                    />
                    <Typography className="status-text">
                        { order.orderStatus === 'in-transit'
                            ? `${ t('text.willBeDelivered') } ${ formatDate(order.estimatedDeliveryDate) }`
                            : order.orderStatus === 'delivered'
                                ? formatDate(order.deliveredAt)
                                : '' }
                    </Typography>
                </div>
            </CardContent>

            <CardContent className="card-content-wrapper">
                <Stack direction="row" spacing={ 1 }>
                    { order.deliveryMethod === "courier" ? <MdLocalShipping size={ 25 } /> : <MdStore size={ 25 } /> }
                    <Typography variant="body2">
                        { t(`text.checkout.orderDeliveryMethods.${ order.deliveryMethod }`) }
                    </Typography>
                </Stack>

                <div>
                    { getFormattedAddressString(order?.address, t) }
                </div>
            </CardContent>

            <CardContent className="card-content-wrapper">
                <Stack direction="row" spacing={ 1 }>
                    <MdPerson size={ 25 } />
                    <Typography variant="body2">{ t('text.checkout.recipient') }</Typography>
                </Stack>
                <Typography className="recipient">
                    { userStore?.user?.name }, { formatPhoneNumber(userStore?.user?.tel) }
                </Typography>
            </CardContent>
        </Card>

    );
};

export default OrderDetailsCard;
