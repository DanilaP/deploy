import { useForm, Controller } from "react-hook-form";
import {
    Rating,
    Typography,
    FormControlLabel,
    Checkbox,
    Button,
    TextField,
    Card,
    Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ChangeEvent } from "react";
import './order-rate-form.scss';
import InputFile from "../../../components-ui/custom-file-nput/file-input.tsx";

const feedbackCriteriaKeys = [
    "deliverySpeed",
    "productQuality",
    "assemblyQuality",
    "productPrice",
    "productCondition",
    "orderProcess",
    "customerService",
    "orderAccuracy",
    "siteConvenience",
];

interface OrderRateFormData {
    comment: string;
    rating: number | null;
    photos: File[];
    feedbackCriteria: {
        [key in typeof feedbackCriteriaKeys[number]]: boolean;
    };
}

const OrderRateForm = () => {
    const { t } = useTranslation();
    const {
        handleSubmit,
        control,
        watch,
        setValue,
    } = useForm<OrderRateFormData>({
        defaultValues: {
            comment: "",
            photos: [],
            rating: null,
            feedbackCriteria: feedbackCriteriaKeys.reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {} as OrderRateFormData['feedbackCriteria']),
        },
    });

    const rating: number | null = watch("rating");
    const photos = watch("photos");

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setValue("photos", [...photos, ...files]);
    };

    const onSubmit = (data: OrderRateFormData) => {};

    return (
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
                        <Typography
                            color="primary"
                            variant="caption"
                            component="legend"
                        >
                            { rating ? t(`text.ratingLabels.${ String(rating) }`): "" }
                        </Typography>
                    </div>
                ) }
            />

            { rating !== null && (
                <div className="feedback-wrapper">
                        <Card className="feedback-criteria-wrapper">
                            { feedbackCriteriaKeys.map((key) => (
                                <Controller
                                    key={ key }
                                    name={ `text.feedbackCriteria.${ key }` }
                                    control={ control }
                                    render={ ({ field }) => (
                                        <FormControlLabel
                                            className="form-label"
                                            control={ <Checkbox { ...field } checked={ typeof field.value === 'boolean' ? field.value : false } /> }
                                            label={ t(`text.feedbackCriteria.${ key }`) }
                                        />
                                    ) }
                                />
                            )) }
                        </Card>

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
                            name="photos"
                            control={ control }
                            render={ ({ field }) => (
                                <Box className="upload-files-wrapper">
                                    <InputFile
                                        { ...field }
                                        onChange={ handleFileUpload }
                                        multiple
                                        accept="image/*"
                                    />
                                    <Typography variant="caption">{ t("text.uploadFiles") }</Typography>
                                </Box>
                            ) }
                        />

                        { photos.length > 0 && (
                            <div className="uploaded-photos">
                                { photos.map((photo, index) => (
                                    <img
                                        key={ index }
                                        className="uploaded-image"
                                        src={ URL.createObjectURL(photo) }
                                        alt={ `uploaded-file-${index}` }
                                    />
                                )) }
                            </div>
                        ) }
                    </Box>

                    <Button className="form-button" type="submit" variant="contained" color="primary">
                            { t("text.send") }
                    </Button>
                </div>
            ) }
        </form>
    );
};

export default OrderRateForm;
