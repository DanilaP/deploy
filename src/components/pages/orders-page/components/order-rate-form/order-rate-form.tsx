import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
    Rating,
    Typography,
    Button,
    TextField,
    Box,
    Collapse,
    IconButton,
    Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ChangeEvent, FC, useState } from "react";
import './order-rate-form.scss';
import InputFile from "../../../../components-ui/custom-file-nput/file-input.tsx";
import Grid from "@mui/material/Grid2";
import {
    BiChevronDown,
    BiChevronUp,
    BiMessageSquareAdd,
    BiMessageSquareMinus,
} from "react-icons/bi";
import { MdCancel } from "react-icons/md";

interface OrderRateFormData {
    comment: string;
    rating: number | null;
    uploadedFiles: { file: File; type: string }[];
    advantages: { info: string }[];
    disadvantages: { info: string }[];
}

const OrderRateForm: FC<{ closeModal: () => void }> = ({ closeModal }) => {
    const { t } = useTranslation();
    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState,
    } = useForm<OrderRateFormData>({
        defaultValues: {
            comment: "",
            rating: null,
            uploadedFiles: [],
            advantages: [],
            disadvantages: []
        },
    });

    const rating: number | null = watch("rating");
    const uploadedFiles = watch("uploadedFiles");
    const [isFeedbackDetailsOpen, setIsFeedbackDetailsOpen] = useState(false);

    const {
        fields: advantagesFields,
        append: appendAdvantages,
        remove: removeAdvantages,
    } = useFieldArray({
        control,
        name: "advantages",
    });

    const {
        fields: disadvantagesFields,
        append: appendDisadvantages,
        remove: removeDisadvantages,
    } = useFieldArray({
        control,
        name: "disadvantages",
    });

    const handleAddField = (type: 'advantages' | 'disadvantages') => {
        const fields = type === 'advantages' ? advantagesFields : disadvantagesFields;
        const appendField = type === 'advantages' ? appendAdvantages : appendDisadvantages;

        if (fields.length < 10) {
            appendField({ info: '' });
        }
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const updatedFiles = files.map(file => ({
            file,
            type: file.type.startsWith('image') ? 'photo' : file.type.startsWith('video') ? 'video' : 'unsupported',
        }));

        const validFiles = updatedFiles
            .filter((f) => f.type !== 'unsupported');
        setValue('uploadedFiles', [...uploadedFiles, ...validFiles]);
    };

    const onSubmit = (data: OrderRateFormData) => {
        setTimeout(() => {
            closeModal();
        }, 2000);
    };

    return (
        formState.isSubmitSuccessful ? (
            <Box className="confirmation-message">
                <Typography variant="h6">{ t('text.thankYouMessage') }!</Typography>
            </Box>
            ) : (
                <form className="order-rate-form" onSubmit={ handleSubmit(onSubmit) }>
                    <Controller
                        name="rating"
                        control={ control }
                        render={ ({ field }) => (
                            <div className="rating-data-wrapper">
                                <Rating
                                    { ...field }
                                    size="large"
                                    onChange={ (_, value) => field.onChange(value) }
                                />
                            </div>
                        ) }
                    />

                    { rating !== null && (
                        <div className="feedback-wrapper">
                            <Controller
                                name="comment"
                                control={ control }
                                render={ ({ field }) => (
                                    <TextField
                                        className="comment-field"
                                        { ...field }
                                        label={ t("text.yourComment") }
                                        variant="outlined"
                                        multiline
                                        rows={ 2 }
                                        fullWidth
                                    />
                                ) }
                            />
                            <Box>
                                <Controller
                                    name="uploadedFiles"
                                    control={ control }
                                    render={ ({ field }) => (
                                        <Box className="upload-files-wrapper">
                                            <InputFile
                                                { ...field }
                                                onChange={ handleFileUpload }
                                                multiple
                                                accept="image/*,video/*"
                                            />
                                            <Typography variant="caption">{ t("text.uploadFiles") }</Typography>
                                        </Box>
                                    ) }
                                />
                                <div className="uploaded-files">
                                    { uploadedFiles.map((fileObj, index) => {
                                        if (fileObj.type === 'photo') {
                                            return (
                                                <img
                                                    key={ `${ index }${ fileObj.type }` }
                                                    className="uploaded-item"
                                                    src={ URL.createObjectURL(fileObj.file) }
                                                    alt={ `uploaded-photo-${ index }` }
                                                />
                                            );
                                        }
                                        if (fileObj.type === 'video') {
                                            return (
                                                <video key={ `${ index }${ fileObj.type }` } className="uploaded-item" controls>
                                                    <source src={ URL.createObjectURL(fileObj.file) } />
                                                </video>
                                            );
                                        }
                                        return null;
                                    }) }
                                </div>
                            </Box>

                            <div className="feedback-details-wrapper">
                                <Button onClick={ () => setIsFeedbackDetailsOpen(!isFeedbackDetailsOpen) }>
                                    { t('text.expandFeedback') }
                                    { isFeedbackDetailsOpen ? <BiChevronUp /> : <BiChevronDown /> }
                                </Button>

                                <Collapse in={ isFeedbackDetailsOpen }>
                                    <Grid container spacing={ 2 }>
                                        <Grid size={ { xs: 6 } }>
                                            <Stack direction="row" spacing={ 1 }>
                                                <Typography variant="body1">{ t('text.advantages') }</Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={ () => handleAddField('advantages') }
                                                >
                                                    <BiMessageSquareAdd />
                                                </IconButton>
                                            </Stack>
                                            <div className="advantages-wrapper">
                                                { advantagesFields.map((field, index) => (
                                                    <div className="advantage-field" key={ field.id }>
                                                        <Controller
                                                            name={ `advantages[${index}].info` }
                                                            control={ control }
                                                            render={ ({ field }) => (
                                                                <TextField
                                                                    size="small"
                                                                    { ...field }
                                                                    variant="outlined"
                                                                />
                                                            ) }
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            onClick={ () => removeAdvantages(index) }
                                                        >
                                                            <MdCancel/>
                                                        </IconButton>
                                                    </div>
                                                )) }
                                            </div>
                                        </Grid>

                                        <Grid size={ { xs: 6 } }>
                                            <Stack direction="row" spacing={ 1 }>
                                                <Typography variant="body1">{ t('text.disadvantages') }</Typography>
                                                <IconButton
                                                    onClick={ () => handleAddField('disadvantages') }
                                                    size="small"
                                                >
                                                    <BiMessageSquareMinus />
                                                </IconButton>
                                            </Stack>
                                            <div className="disadvantages-wrapper">
                                                { disadvantagesFields.map((field, index) => (
                                                    <div className="disadvantage-field" key={ field.id }>
                                                        <Controller
                                                            name={ `disadvantages[${index}].info` }
                                                            control={ control }
                                                            render={ ({ field }) => (
                                                                <TextField
                                                                    size="small"
                                                                    { ...field }
                                                                    variant="outlined"
                                                                />
                                                            ) }
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            onClick={ () => removeDisadvantages(index) }
                                                        >
                                                            <MdCancel />
                                                        </IconButton>
                                                    </div>
                                                )) }
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Collapse>
                            </div>

                            <div className="form-button-wrapper">
                                <Button type="submit" variant="contained" color="primary">
                                    { t("text.send") }
                                </Button>
                            </div>

                        </div>
                    ) }
                </form>

            )
    );
};

export default OrderRateForm;
