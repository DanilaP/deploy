import { ChangeEvent, useRef } from "react";
import "./file-input.scss";
import { FiPlusCircle } from "react-icons/fi";

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
            <FiPlusCircle fontSize={25} />
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