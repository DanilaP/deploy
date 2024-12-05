import './product-info-tooltip.scss';
import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { BsInfoCircle } from "react-icons/bs";

const ProductInfoTooltip: FC<any> = ({ additionalInfo, onClickHandler }) => {
    return (
        <Tooltip
            title={
                <div className="additional-info-tooltip">
                    { additionalInfo.map((info: any) => (
                        <div key={ info.id } className="additional-info-item">
                            <strong>{ info.name }:</strong> { info.description }
                        </div>
                    )) }
                </div>
            }
            arrow
        >
            <IconButton onClick={onClickHandler} className="info-button">
                <BsInfoCircle size={ 20 } />
            </IconButton>
        </Tooltip>
    );
};

export default ProductInfoTooltip;
