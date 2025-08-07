import React, { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/i18n';

interface I18nProviderProps {
    children: ReactNode;
}

const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
    // Khởi động i18n và đặt ngôn ngữ từ localStorage nếu có
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }, []);

    return (
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
    );
};

export default I18nProvider;
