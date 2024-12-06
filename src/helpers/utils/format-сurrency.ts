const formatCurrency = (amount: number, locale = 'ru-RU') => amount.toLocaleString(locale);
export default formatCurrency;
