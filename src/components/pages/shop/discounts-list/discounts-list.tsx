import { Checkbox } from "@mui/material";
import { IDiscount } from "../../../../models/discounts/discounts";
import "./discounts-list.scss";
import { useTranslation } from "react-i18next";

interface IDiscounstListProps {
    discounts: IDiscount[],
    selectedDiscount: IDiscount | null,
    handleGetCountOfProductsForDiscount: (discount: IDiscount) => number,
    handleUpdateSelectedDiscount: (discount: IDiscount | null) => void,
}

export default function DiscounstList({
    discounts,
    selectedDiscount,
    handleGetCountOfProductsForDiscount,
    handleUpdateSelectedDiscount
}: IDiscounstListProps) {

    const { t } = useTranslation();

    const handleOnChangeCheckbox = (discount: IDiscount) => {
        if (selectedDiscount && selectedDiscount.id === discount.id) {
            handleUpdateSelectedDiscount(null);
        }
        if (selectedDiscount && selectedDiscount.id !== discount.id) {
            handleUpdateSelectedDiscount(discount);
        }
        if (!selectedDiscount) {
            handleUpdateSelectedDiscount(discount);
        }
    };

    return (
        <div className="discounts-view">
            <div className="default-discounts">
                <div className="discount-title">
                    { t("text.discounts") } 
                    <span className="title-helper-text"> ({ t("text.allGoods") })</span>
                </div>
                {
                    discounts.map(el => {
                        if (el.type === "discount" && el.active) {
                            return (
                                <div key={ el.id } className="discount-wrapper">
                                    <div className="discount-select">
                                        <Checkbox
                                            checked={ selectedDiscount?.id === el.id }
                                            onChange={ () => handleOnChangeCheckbox(el) }
                                        />
                                    </div>
                                    <div className="discount-wrapper-title">
                                        { el.name } ({ handleGetCountOfProductsForDiscount(el) })
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
                                        <Checkbox
                                            checked={ selectedDiscount?.id === el.id }
                                            onChange={ () => handleOnChangeCheckbox(el) }
                                        />
                                    </div>
                                    <div className="discount-wrapper-title">
                                        { el.name } ({ handleGetCountOfProductsForDiscount(el) })
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