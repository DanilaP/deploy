import { ChangeEvent, useRef } from "react";
import "./file-input.scss";
import { ControlPoint } from '@material-ui/icons';

export default function InputFile(props: { 
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
    width?: string,
    height?: string
    accept?: string,
    multiple?: boolean
}) {

    const ref = useRef(null);

    return( 
        <div className="form-group">
            <ControlPoint style={{ width: props.width || "50px", height: props.height || "50px", cursor: "pointer" }}/>
            <input 
                ref={ref}
                style={{ width: props.width, height: props.height }}
                type="file" 
                className="input-type-file" 
                multiple={props.multiple || false}
                onChange={(event) => props.onChange!(event)} accept={props.accept || ".jpg,.jpeg,.png,.gif"}
            />
        </div>
    );
}