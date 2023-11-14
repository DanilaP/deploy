import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

import en from "./resources/en.json";
import ru from "./resources/ru.json";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            ru: {
                translation: ru
            },
            en: {
                translation: en
            }
        }
    });
i18n.changeLanguage("ru");

export  { useTranslation }