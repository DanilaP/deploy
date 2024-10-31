import { ChangeEvent, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./file-input.scss";
import { ControlPoint } from '@material-ui/icons';

export default function InputFile(props: { 
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void 
}) {

    const ref = useRef(null);
    const { t } = useTranslation();

    return( 
        <div className="form-group">
            <ControlPoint color="primary" style={{ width: "30px", height: "30px", cursor: "pointer" }}/>
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