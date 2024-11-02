import { ChangeEvent, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./file-input.scss";
import { MdOutlineControlPoint } from "react-icons/md";

export default function InputFile(props: { 
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void 
}) {

    const ref = useRef(null);
    const { t } = useTranslation();

    return( 
        <div className="form-group">
            <MdOutlineControlPoint className='icon' color="primary" />
            <label className="label">
                <input 
                    ref={ref} 
                    type="file" 
                    className="input-type-file" 
                    onChange={(event) => props.onChange!(event)} accept=".jpg,.jpeg,.png,.gif,.mp4, .avi"
                />
            </label>
        </div>
    )
}