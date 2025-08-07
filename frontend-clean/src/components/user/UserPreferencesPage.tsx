import React, { useState, useEffect, useContext } from 'react';
import {
    Container, Box, Typography, Paper, TextField, Switch, Slider,
    FormControlLabel, Chip, Button, Grid, FormControl, InputLabel,
    Select, MenuItem, CircularProgress, Snackbar, Alert, SelectChangeEvent
} from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { useSmartCookingApi } from '../../hooks/useSmartCookingApi';
import { useTranslation } from 'react-i18next';
import { SpicePreference, UserPreference } from '../../types/api';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { GridContainer, GridItem } from '../common/GridHelper';

const UserPreferencesPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation('common');
    const {
        getUserPreferences,
        saveUserPreferences,
        updateUserPreference,
        addCuisinePreference,
        addLikedIngredient,
        addDislikedIngredient,
        loading,
        error
    } = useSmartCookingApi();

    const [preferences, setPreferences] = useState<UserPreference>({
        userId: 0,
        languagePreference: 'vi',
        cuisinePreferences: [],
        dietaryPreferences: [],
        likedIngredients: [],
        dislikedIngredients: [],
        spicePreference: SpicePreference.MEDIUM,
        aiAssistantEnabled: true,
        preferredAiModel: 'gpt-4',
        darkMode: false,
        personalizationLevel: 5,
        enableRecommendations: true
    });

    const [newCuisine, setNewCuisine] = useState<string>('');
    const [newLikedIngredient, setNewLikedIngredient] = useState<string>('');
    const [newDislikedIngredient, setNewDislikedIngredient] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    // Tải tùy chọn người dùng khi component được mount
    useEffect(() => {
        if (user && user.id) {
            loadUserPreferences(user.id);
            setPreferences(prev => ({ ...prev, userId: user.id }));
        }
    }, [user]);

    // Tải tùy chọn người dùng từ API
    const loadUserPreferences = async (userId: number): Promise<void> => {
        try {
            const data = await getUserPreferences(userId);
            if (data) {
                setPreferences(data);
            }
        } catch (err) {
            console.error('Error loading user preferences:', err);
        }
    };

    // Xử lý thay đổi các trường input
    const handleChange = (field: keyof UserPreference) => (
        event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent
    ): void => {
        let value: any = event.target.value;
        if (field === 'aiAssistantEnabled' || field === 'darkMode' || field === 'enableRecommendations') {
            value = (event as React.ChangeEvent<HTMLInputElement>).target.checked;
        }
        setPreferences({ ...preferences, [field]: value });
    };

    // Xử lý thay đổi slider
    const handleSliderChange = (_event: Event, newValue: number | number[]): void => {
        setPreferences({ ...preferences, personalizationLevel: newValue as number });
    };

    // Lưu tất cả tùy chọn
    const handleSaveAll = async (): Promise<void> => {
        try {
            await saveUserPreferences(preferences);
            setSuccessMessage(t('preferences.saveSuccess'));
            setShowSuccess(true);
        } catch (err) {
            console.error('Error saving preferences:', err);
        }
    };

    // Cập nhật một trường cụ thể
    const handleUpdateField = async (field: keyof UserPreference, value: any): Promise<void> => {
        if (!user || !user.id) return;

        try {
            await updateUserPreference(user.id, field, value);
            setSuccessMessage(t('preferences.fieldUpdateSuccess', { field }));
            setShowSuccess(true);
        } catch (err) {
            console.error(`Error updating ${field}:`, err);
        }
    };

    // Thêm sở thích ẩm thực
    const handleAddCuisine = async (): Promise<void> => {
        if (!newCuisine || !user || !user.id) return;

        try {
            const updatedPrefs = await addCuisinePreference(user.id, newCuisine);
            setPreferences(updatedPrefs);
            setNewCuisine('');
            setSuccessMessage(t('preferences.cuisineAddedSuccess'));
            setShowSuccess(true);
        } catch (err) {
            console.error('Error adding cuisine:', err);
        }
    };

    // Thêm nguyên liệu yêu thích
    const handleAddLikedIngredient = async (): Promise<void> => {
        if (!newLikedIngredient || !user || !user.id) return;

        try {
            const updatedPrefs = await addLikedIngredient(user.id, newLikedIngredient);
            setPreferences(updatedPrefs);
            setNewLikedIngredient('');
            setSuccessMessage(t('preferences.ingredientAddedSuccess'));
            setShowSuccess(true);
        } catch (err) {
            console.error('Error adding liked ingredient:', err);
        }
    };

    // Thêm nguyên liệu không thích
    const handleAddDislikedIngredient = async (): Promise<void> => {
        if (!newDislikedIngredient || !user || !user.id) return;

        try {
            const updatedPrefs = await addDislikedIngredient(user.id, newDislikedIngredient);
            setPreferences(updatedPrefs);
            setNewDislikedIngredient('');
            setSuccessMessage(t('preferences.dislikedIngredientAddedSuccess'));
            setShowSuccess(true);
        } catch (err) {
            console.error('Error adding disliked ingredient:', err);
        }
    };

    // Xử lý đóng thông báo thành công
    const handleCloseSuccess = (): void => {
        setShowSuccess(false);
    };

    if (!user) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h4">{t('preferences.pleaseLogin')}</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('preferences.title')}
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <GridContainer container spacing={3}>
                            {/* Ngôn ngữ */}
                            <GridItem item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="language-select-label">{t('preferences.language')}</InputLabel>
                                    <Select
                                        labelId="language-select-label"
                                        value={preferences.languagePreference}
                                        label={t('preferences.language')}
                                        onChange={handleChange('languagePreference')}
                                    >
                                        <MenuItem value="vi">Tiếng Việt</MenuItem>
                                        <MenuItem value="en">English</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Mức độ cay */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="spice-select-label">{t('preferences.spiceLevel')}</InputLabel>
                                    <Select
                                        labelId="spice-select-label"
                                        value={preferences.spicePreference}
                                        label={t('preferences.spiceLevel')}
                                        onChange={handleChange('spicePreference')}
                                    >
                                        <MenuItem value={SpicePreference.MILD}>{t('preferences.mild')}</MenuItem>
                                        <MenuItem value={SpicePreference.MEDIUM}>{t('preferences.medium')}</MenuItem>
                                        <MenuItem value={SpicePreference.HOT}>{t('preferences.hot')}</MenuItem>
                                        <MenuItem value={SpicePreference.EXTRA_HOT}>{t('preferences.extraHot')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* AI model */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="ai-model-select-label">{t('preferences.aiModel')}</InputLabel>
                                    <Select
                                        labelId="ai-model-select-label"
                                        value={preferences.preferredAiModel}
                                        label={t('preferences.aiModel')}
                                        onChange={handleChange('preferredAiModel')}
                                    >
                                        <MenuItem value="gpt-4">GPT-4</MenuItem>
                                        <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                                        <MenuItem value="gemini-pro">Gemini Pro</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Mức độ cá nhân hóa */}
                            <Grid item xs={12}>
                                <Typography id="personalization-slider" gutterBottom>
                                    {t('preferences.personalizationLevel')}: {preferences.personalizationLevel}
                                </Typography>
                                <Slider
                                    value={preferences.personalizationLevel}
                                    onChange={handleSliderChange}
                                    onChangeCommitted={() => handleUpdateField('personalizationLevel', preferences.personalizationLevel)}
                                    aria-labelledby="personalization-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks
                                    min={1}
                                    max={10}
                                />
                            </Grid>

                            {/* Công tắc */}
                            <Grid item xs={12} sm={4}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={preferences.aiAssistantEnabled}
                                            onChange={handleChange('aiAssistantEnabled')}
                                            onBlur={() => handleUpdateField('aiAssistantEnabled', preferences.aiAssistantEnabled)}
                                        />
                                    }
                                    label={t('preferences.enableAiAssistant')}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={preferences.darkMode}
                                            onChange={handleChange('darkMode')}
                                            onBlur={() => handleUpdateField('darkMode', preferences.darkMode)}
                                        />
                                    }
                                    label={t('preferences.darkMode')}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={preferences.enableRecommendations}
                                            onChange={handleChange('enableRecommendations')}
                                            onBlur={() => handleUpdateField('enableRecommendations', preferences.enableRecommendations)}
                                        />
                                    }
                                    label={t('preferences.enableRecommendations')}
                                />
                            </Grid>

                            {/* Sở thích ẩm thực */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    {t('preferences.cuisinePreferences')}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                    {preferences.cuisinePreferences && preferences.cuisinePreferences.map((cuisine, index) => (
                                        <Chip key={index} label={cuisine} color="primary" />
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        label={t('preferences.newCuisine')}
                                        value={newCuisine}
                                        onChange={(e) => setNewCuisine(e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleAddCuisine}
                                        disabled={!newCuisine}
                                    >
                                        {t('common.add')}
                                    </Button>
                                </Box>
                            </Grid>

                            {/* Nguyên liệu yêu thích */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    {t('preferences.likedIngredients')}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                    {preferences.likedIngredients && preferences.likedIngredients.map((ingredient, index) => (
                                        <Chip key={index} label={ingredient} color="success" />
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        label={t('preferences.newIngredient')}
                                        value={newLikedIngredient}
                                        onChange={(e) => setNewLikedIngredient(e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleAddLikedIngredient}
                                        disabled={!newLikedIngredient}
                                    >
                                        {t('common.add')}
                                    </Button>
                                </Box>
                            </Grid>

                            {/* Nguyên liệu không thích */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    {t('preferences.dislikedIngredients')}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                    {preferences.dislikedIngredients && preferences.dislikedIngredients.map((ingredient, index) => (
                                        <Chip key={index} label={ingredient} color="error" />
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        label={t('preferences.newIngredient')}
                                        value={newDislikedIngredient}
                                        onChange={(e) => setNewDislikedIngredient(e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleAddDislikedIngredient}
                                        disabled={!newDislikedIngredient}
                                    >
                                        {t('common.add')}
                                    </Button>
                                </Box>
                            </Grid>

                            {/* Nút lưu */}
                            <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={handleSaveAll}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : t('common.saveAll')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {/* Hiển thị thông báo lỗi nếu có */}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Snackbar cho thông báo thành công */}
                <Snackbar
                    open={showSuccess}
                    autoHideDuration={6000}
                    onClose={handleCloseSuccess}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default UserPreferencesPage;
