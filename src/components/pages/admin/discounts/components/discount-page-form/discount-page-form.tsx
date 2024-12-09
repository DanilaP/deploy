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
    discountTypesForSelect: ISelect[],
    handleCloseModal: () => void,
    handleSaveDiscountData: (discount: IDiscount) => void
}

interface IDiscountForm {
    id?: number,
    name: string,
    systemKey: string,
    value: number,
    dateStart: string,
    dateEnd: string | null,
    categories: ISelect[],
    active: boolean,
    deletedAt: string | null,
    type: ISelect
}

export default function DiscountPageForm({
    currentDiscount,
    categoriesForSelect,
    discountTypesForSelect,
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
                categories: categoriesForSelect.filter(el => currentDiscount.categories?.includes(el.id)),
                type: discountTypesForSelect.find(el => el.id === currentDiscount.type)
            }
            : {
                categories: [],
                type: discountTypesForSelect[0]
            }
    });
    
    const { t } = useTranslation();

    const handleSaveDiscountFormData = (data: IDiscountForm) => {
        const updatedDiscountData: IDiscount = {
            ...data,
            categories: data.categories?.map(el => el.id) || [],
            type: data.type.id
        };
        handleSaveDiscountData(updatedDiscountData);
    };

    const handleValidateDiscountValue = (value: number) => {
        if (!validateRequiredField(value)) return t("errors.requiredField");
        if (watch("type").id === "discount") {
            if (value <= 0 || value >= 100) return t("errors.invalidDiscountValue");
        }
        return true;
    };

    return (
        <form className="discount-page-form" onSubmit={ handleSubmit(handleSaveDiscountFormData) }>
            <FormControl>
                <FormLabel 
                    className="discount-field-label"
                >{ t("text.typeOfDiscount") }</FormLabel>
                <Controller
                    name="type"
                    control={ control }
                    rules={ { required: t("errors.requiredField") } }
                    render={ ({ field }) => (
                        <Autocomplete
                            { ...field }
                            options={ discountTypesForSelect }
                            onChange={ (_, value) => field.onChange(value) }
                            renderInput={ (params) => (
                                <TextField
                                    placeholder={ t("text.search") }
                                    { ...params }
                                    id="type-of-discount"
                                    error={ Boolean(errors.type) }
                                    helperText={ String(errors.type?.message || "") }
                                />
                            ) }
                        />
                    ) }
                />
            </FormControl>
            <FormControl>
                <FormLabel 
                    className="discount-field-label"
                    htmlFor="discount-category-value"
                >
                    { 
                        watch("type").id === "promo" 
                        ? t("text.promoSum")
                        : t("text.discountValue")
                    }
                </FormLabel>
                <TextField
                    type="number"
                    error={ Boolean(errors.value) }
                    helperText={ String(errors.value?.message || "") }
                    id="update-discount-value"
                    placeholder={ t("text.value") }
                    { ...register("value", {
                        validate: (value: number) => handleValidateDiscountValue(value),
                        valueAsNumber: true
                    }) }
                />
            </FormControl>
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