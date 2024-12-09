import { Controller, useForm } from "react-hook-form";
import { Autocomplete, Button, Checkbox, FormControl, FormLabel, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { IDiscount } from "../../../../../../models/discounts/discounts";
import { ISelect } from "../../../../../../interfaces/interfaces";
import { validateRequiredField } from "../../../../../../helpers/validators/validators-helper";
import "./discount-page-form.scss";

interface IDiscountPageFormProps {
    currentDiscount: IDiscount | null,
    categoriesForSelect: ISelect[],
    handleCloseModal: () => void,
    handleSaveDiscountData: (discount: IDiscount) => void
}

interface IDiscountForm {
    id?: number,
    name: string,
    systemKey: string,
    percentage: number,
    dateStart: string,
    dateEnd: string | null,
    categories: ISelect[],
    active: boolean,
    deletedAt: string | null
}

export default function DiscountPageForm({
    currentDiscount,
    categoriesForSelect,
    handleCloseModal,
    handleSaveDiscountData
}: IDiscountPageFormProps) {

    const { 
        handleSubmit, 
        watch, 
        register,
        control,
        formState: { errors, isValid, submitCount }
    } = useForm<IDiscountForm>({
        defaultValues: currentDiscount 
            ? {
                ...currentDiscount,
                categories: categoriesForSelect.filter(el => currentDiscount.categories?.includes(el.id))
            }
            : {
                categories: []
            }
    });
    
    const { t } = useTranslation();

    const handleSaveDiscountFormData = (data: IDiscountForm) => {
        const updatedDiscountData: IDiscount = {
            ...data,
            categories: data.categories?.map(el => el.id) || []
        };
        handleSaveDiscountData(updatedDiscountData);
    };

    return (
        <form className="discount-page-form" onSubmit={ handleSubmit(handleSaveDiscountFormData) }>
            <FormControl>
                <FormLabel 
                    className="discount-field-label"
                    htmlFor="discount-category-systemKey"
                >{ t("text.systemKey") }</FormLabel>
                <TextField
                    error={ Boolean(errors.systemKey) }
                    helperText={ String(errors.systemKey?.message || "") }
                    id="update-discount-systemKey"
                    placeholder={ t("text.systemKey") }
                    { ...register("systemKey", {
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                    }) }
                />
            </FormControl>
            <FormControl>
                <FormLabel 
                    className="discount-field-label"
                    htmlFor="discount-category-name"
                >{ t("text.name") }</FormLabel>
                <TextField
                    error={ Boolean(errors.name) }
                    helperText={ String(errors.name?.message || "") }
                    id="update-discount-name"
                    placeholder={ t("text.name") }
                    { ...register("name", {
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                    }) }
                />
            </FormControl>
            <FormControl>
                <FormLabel 
                    className="discount-field-label"
                >{ t("text.category") }</FormLabel>
                <Controller
                    name="categories"
                    control={ control }
                    render={ ({ field }) => (
                        <Autocomplete
                            { ...field }
                            multiple
                            limitTags={ 2 }
                            options={ 
                                categoriesForSelect.filter(optionValue => {
                                    return !field.value?.some(selectedValue => optionValue.id === selectedValue.id );
                                })
                            }
                            onChange={ (_, value) => field.onChange(value) }
                            renderInput={ (params) => (
                                <TextField
                                    placeholder={ t("text.search") }
                                    { ...params }
                                    id="update-good-category"
                                    error={ Boolean(errors.categories) }
                                    helperText={ String(errors.categories?.message || "") }
                                />
                            ) }
                        />
                    ) }
                />
            </FormControl>
            <FormControl>
                <FormLabel 
                    className="discount-field-label"
                    htmlFor="discount-category-dateStart"
                >{ t("text.dateStart") }</FormLabel>
                <TextField
                    type="date"
                    error={ Boolean(errors.dateStart) }
                    helperText={ String(errors.dateStart?.message || "") }
                    id="update-discount-dateStart"
                    placeholder={ t("text.dateStart") }
                    { ...register("dateStart", {
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                    }) }
                />
            </FormControl>
            <FormControl>
                <FormLabel 
                    className="discount-field-label"
                    htmlFor="discount-category-dateEnd"
                >{ t("text.dateEnd") }</FormLabel>
                <TextField
                    type="date"
                    error={ Boolean(errors.dateEnd) }
                    helperText={ String(errors.dateEnd?.message || "") }
                    id="update-discount-dateEnd"
                    placeholder={ t("text.dateEnd") }
                    { ...register("dateEnd") }
                />
            </FormControl>
            <FormControl>
                <FormLabel 
                    className="discount-field-label"
                    htmlFor="discount-category-percentage"
                >{ t("text.percentage") }</FormLabel>
                <TextField
                    type="number"
                    error={ Boolean(errors.percentage) }
                    helperText={ String(errors.percentage?.message || "") }
                    id="update-discount-percentage"
                    placeholder={ t("text.percentage") }
                    { ...register("percentage", {
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField"),
                        valueAsNumber: true
                    }) }
                />
            </FormControl>
            <div className="horizontal-form-control">
                <Checkbox
                    className="field-checkbox"
                    { ...register("active") }
                    checked={ watch("active") || false }
                />
                <FormLabel className="discount-field-label">{ t("text.active") }</FormLabel>
            </div>
            <div className="form-actions">
                <Button 
                    type="submit"
                    disabled={ submitCount !== 0 && !isValid }
                    variant="contained"
                >{ t("text.save") }</Button>
                <Button 
                    type="submit"
                    onClick={ handleCloseModal }
                    variant="contained"
                >{ t("text.cancel") }</Button>
            </div>
        </form>
    );
}