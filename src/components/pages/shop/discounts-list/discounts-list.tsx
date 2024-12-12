import { Checkbox } from "@mui/material";
import { IDiscount } from "../../../../models/discounts/discounts";
import "./discounts-list.scss";
import { useTranslation } from "react-i18next";

interface IDiscounstListProps {
    discounts: IDiscount[],
}

export default function DiscounstList({
    discounts,
}: IDiscounstListProps) {

    const { t } = useTranslation();

    return (
        <div className="discounts-view">
            <div className="default-discounts">
                <div className="discount-title">{ t("text.discounts") }</div>
                {
                    discounts.map(el => {
                        if (el.type === "discount" && el.active) {
                            return (
                                <div key={ el.id } className="discount-wrapper">
                                    <div className="discount-select">
                                        <Checkbox />
                                    </div>
                                    <div className="discount-wrapper-title">
                                        { el.name }
                                    </div>
                                </div>
                            );
                        }
                    })
                }
            </div>
            <div className="promo-discounts">
                <div className="discount-title">{ t("discountTypes.promo") }</div>
                {
                    discounts.map(el => {
                        if (el.type === "promo" && el.active) {
                            return (
                                <div key={ el.id } className="discount-wrapper">
                                    <div className="discount-select">
                                        <Checkbox />
                                    </div>
                                    <div className="discount-wrapper-title">
                                        { el.name }
                                    </div>
                                </div>
                            );
                        }
                    })
                }
            </div>
        </div>
    );
}