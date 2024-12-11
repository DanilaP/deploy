import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import "./re-captcha.scss";

interface IReCaptchaProps {
    title: string,
    handleSuccessfulPassing: (value: string | null) => void
}

export default function ReCaptcha({
    title,
    handleSuccessfulPassing
}: IReCaptchaProps) {

    const { t } = useTranslation();
    const siteKey = import.meta.env.VITE_APP_RE_CAPTCHA_TESTING_KEY;

    return (
        <div className="re-captcha-block">
            <div className="re-captcha-title">
                { t(title) }
            </div>
            <div className="re-captcha-content">
                <ReCAPTCHA
                    sitekey={ siteKey }
                    onChange={ handleSuccessfulPassing }
                />
            </div>
        </div>
    );
}