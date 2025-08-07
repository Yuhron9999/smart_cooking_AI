import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
    InputLabel,
    Box
} from '@mui/material';

// Define các ngôn ngữ được hỗ trợ
const languages = [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Tiếng Việt' }
];

interface LanguageSwitcherProps {
    variant?: 'standard' | 'filled' | 'outlined';
    size?: 'small' | 'medium';
    label?: boolean;
    className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    variant = 'outlined',
    size = 'small',
    label = true,
    className
}) => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState<string>(i18n.language);

    // Cập nhật state khi ngôn ngữ thay đổi từ bên ngoài
    useEffect(() => {
        setLanguage(i18n.language);
    }, [i18n.language]);

    const handleChange = (event: SelectChangeEvent) => {
        const newLanguage = event.target.value;
        setLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);

        // Lưu ngôn ngữ đã chọn vào localStorage để duy trì giữa các phiên
        localStorage.setItem('preferredLanguage', newLanguage);
    };

    return (
        <Box className={className}>
            <FormControl variant={variant} size={size} fullWidth>
                {label && <InputLabel id="language-select-label">Language</InputLabel>}
                <Select
                    labelId="language-select-label"
                    id="language-select"
                    value={language}
                    onChange={handleChange}
                    label={label ? "Language" : undefined}
                    sx={{ minWidth: '120px' }}
                >
                    {languages.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code}>
                            {lang.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default LanguageSwitcher;
