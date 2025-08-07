import React, { useState, useContext, useRef, useEffect } from 'react';
import {
    Container, Box, Typography, Paper, TextField, Button,
    CircularProgress, Divider, FormControlLabel, Switch,
    Slider, FormControl, InputLabel, Select, MenuItem,
    Grid, Alert, Stepper, Step, StepLabel, Card, CardContent,
    SelectChangeEvent
} from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { useSmartCookingApi } from '../../hooks/useSmartCookingApi';
import { useTranslation } from 'react-i18next';
import { GridContainer, GridItem } from '../common/GridHelper';
import {
    AiGenerationRequest,
    AiGenerationResponse,
    ParsedRecipe
} from '../../types/api';

const AiRecipeGenerator: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation('common');
    const { generateRecipe, loading, error } = useSmartCookingApi();

    const [activeStep, setActiveStep] = useState<number>(0);
    const [request, setRequest] = useState<AiGenerationRequest>({
        userId: user?.id || 0,
        prompt: '',
        aiModel: 'gpt-4',
        generationType: 'RECIPE',
        includePreferences: true,
        includeDietaryRestrictions: true,
        maxTokens: 1000,
        temperature: 0.7,
    });
    const [generatedRecipe, setGeneratedRecipe] = useState<AiGenerationResponse | null>(null);
    const [generationError, setGenerationError] = useState<string | null>(null);

    const contentRef = useRef<HTMLDivElement>(null);

    // Cập nhật userId khi người dùng thay đổi
    useEffect(() => {
        if (user?.id) {
            setRequest(prev => ({ ...prev, userId: user.id }));
        }
    }, [user]);

    // Xử lý thay đổi prompt
    const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRequest({ ...request, prompt: e.target.value });
    };

    // Xử lý thay đổi model AI
    const handleModelChange = (e: SelectChangeEvent) => {
        setRequest({ ...request, aiModel: e.target.value });
    };

    // Xử lý thay đổi switch
    const handleSwitchChange = (name: keyof AiGenerationRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setRequest({ ...request, [name]: e.target.checked });
    };

    // Xử lý thay đổi temperature
    const handleTemperatureChange = (_e: Event, newValue: number | number[]) => {
        setRequest({ ...request, temperature: newValue as number });
    };

    // Xử lý thay đổi maxTokens
    const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setRequest({ ...request, maxTokens: value });
        }
    };

    // Gửi yêu cầu tạo công thức
    const handleGenerate = async (): Promise<void> => {
        if (!user || !user.id) {
            setGenerationError(t('aiRecipeGenerator.pleaseLogin'));
            return;
        }

        if (!request.prompt) {
            setGenerationError(t('aiRecipeGenerator.emptyPromptError'));
            return;
        }

        setGenerationError(null);

        try {
            // Cập nhật userId nếu cần
            const updatedRequest = { ...request, userId: user.id };

            const response = await generateRecipe(updatedRequest);
            if (response && response.content) {
                setGeneratedRecipe(response);
                setActiveStep(1); // Chuyển sang bước xem kết quả

                // Cuộn đến kết quả
                setTimeout(() => {
                    if (contentRef.current) {
                        contentRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        } catch (err: any) {
            console.error('Error generating recipe:', err);
            setGenerationError(err.message || t('common.unexpectedError'));
        }
    };

    // Quay lại bước trước
    const handleBack = (): void => {
        setActiveStep(0);
    };

    // Tạo công thức mới
    const handleNewRecipe = (): void => {
        setRequest({
            ...request,
            prompt: ''
        });
        setGeneratedRecipe(null);
        setActiveStep(0);
    };

    // Phân tích nội dung công thức từ AI
    const parseRecipeContent = (content: string): ParsedRecipe => {
        if (!content) return { title: '', ingredients: [], instructions: [], notes: '' };

        try {
            // Cố gắng phân tích nội dung dưới dạng JSON
            try {
                const jsonContent = JSON.parse(content);
                return {
                    title: jsonContent.title || jsonContent.name || '',
                    ingredients: jsonContent.ingredients || [],
                    instructions: jsonContent.instructions || jsonContent.steps || [],
                    notes: jsonContent.notes || ''
                };
            } catch (e) {
                // Nếu không phải JSON, phân tích văn bản thông thường
                const lines = content.split('\n');

                // Tìm tiêu đề
                let title = lines[0];
                if (title.toLowerCase().includes('recipe:')) {
                    title = title.split('recipe:')[1].trim();
                }

                // Tìm nguyên liệu
                let ingredientsStartIndex = -1;
                let instructionsStartIndex = -1;

                lines.forEach((line, index) => {
                    if (line.toLowerCase().includes('ingredients') && ingredientsStartIndex === -1) {
                        ingredientsStartIndex = index;
                    }
                    if ((line.toLowerCase().includes('instructions') || line.toLowerCase().includes('directions') || line.toLowerCase().includes('steps')) && instructionsStartIndex === -1) {
                        instructionsStartIndex = index;
                    }
                });

                // Nếu không tìm thấy cấu trúc cụ thể, trả về nội dung thô
                if (ingredientsStartIndex === -1 || instructionsStartIndex === -1) {
                    return {
                        title: title,
                        ingredients: [],
                        instructions: [],
                        notes: content
                    };
                }

                // Trích xuất nguyên liệu
                const ingredients: string[] = [];
                for (let i = ingredientsStartIndex + 1; i < instructionsStartIndex; i++) {
                    const line = lines[i].trim();
                    if (line && !line.toLowerCase().includes('ingredients')) {
                        ingredients.push(line);
                    }
                }

                // Trích xuất hướng dẫn
                const instructions: string[] = [];
                for (let i = instructionsStartIndex + 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line && !line.toLowerCase().includes('instructions') && !line.toLowerCase().includes('directions') && !line.toLowerCase().includes('steps')) {
                        // Xóa số thứ tự nếu có
                        let instruction = line;
                        if (/^\d+[\.\)]/.test(instruction)) {
                            instruction = instruction.replace(/^\d+[\.\)]/, '').trim();
                        }
                        instructions.push(instruction);
                    }
                }

                return {
                    title,
                    ingredients,
                    instructions,
                    notes: ''
                };
            }
        } catch (error) {
            console.error('Error parsing recipe content:', error);
            return {
                title: t('aiRecipeGenerator.parseError'),
                ingredients: [],
                instructions: [],
                notes: content
            };
        }
    };

    // Hiển thị công thức được tạo ra
    const renderRecipeResult = (): React.ReactNode => {
        if (!generatedRecipe || !generatedRecipe.content) return null;

        const parsedRecipe = parseRecipeContent(generatedRecipe.content);

        return (
            <Box ref={contentRef}>
                <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        {parsedRecipe.title || t('aiRecipeGenerator.generatedRecipe')}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {parsedRecipe.ingredients.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                {t('aiRecipeGenerator.ingredients')}
                            </Typography>
                            <ul>
                                {parsedRecipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </Box>
                    )}

                    {parsedRecipe.instructions.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                {t('aiRecipeGenerator.instructions')}
                            </Typography>
                            <ol>
                                {parsedRecipe.instructions.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </Box>
                    )}

                    {parsedRecipe.notes && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                {t('aiRecipeGenerator.notes')}
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {parsedRecipe.notes}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            {t('aiRecipeGenerator.rawResponse')}
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                {generatedRecipe.content}
                            </Typography>
                        </Paper>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleBack}
                        >
                            {t('common.back')}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNewRecipe}
                        >
                            {t('aiRecipeGenerator.createAnotherRecipe')}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        );
    };

    // Hiển thị thống kê sinh
    const renderGenerationStats = (): React.ReactNode => {
        if (!generatedRecipe) return null;

        return (
            <GridContainer container spacing={3} sx={{ mt: 2 }}>
                <GridItem item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                {t('aiRecipeGenerator.processingTime')}
                            </Typography>
                            <Typography variant="h6">
                                {generatedRecipe.processingTimeMs ? `${(generatedRecipe.processingTimeMs / 1000).toFixed(2)}s` : 'N/A'}
                            </Typography>
                        </CardContent>
                    </Card>
                </GridItem>
                <GridItem item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                {t('aiRecipeGenerator.tokensUsed')}
                            </Typography>
                            <Typography variant="h6">
                                {generatedRecipe.tokensUsed || 'N/A'}
                            </Typography>
                        </CardContent>
                    </Card>
                </GridItem>
                <GridItem item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                                {t('aiRecipeGenerator.aiModel')}
                            </Typography>
                            <Typography variant="h6">
                                {request.aiModel}
                            </Typography>
                        </CardContent>
                    </Card>
                </GridItem>
            </GridContainer>
        );
    };

    if (!user) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h5">{t('aiRecipeGenerator.pleaseLogin')}</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('aiRecipeGenerator.title')}
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    <Step>
                        <StepLabel>{t('aiRecipeGenerator.step1')}</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>{t('aiRecipeGenerator.step2')}</StepLabel>
                    </Step>
                </Stepper>

                {activeStep === 0 && (
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <TextField
                            fullWidth
                            label={t('aiRecipeGenerator.promptLabel')}
                            placeholder={t('aiRecipeGenerator.promptPlaceholder')}
                            multiline
                            rows={4}
                            value={request.prompt}
                            onChange={handlePromptChange}
                            margin="normal"
                            variant="outlined"
                        />

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom>
                            {t('aiRecipeGenerator.advancedSettings')}
                        </Typography>

                        <GridContainer container spacing={3}>
                            <GridItem item xs={12} sm={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="ai-model-label">{t('aiRecipeGenerator.aiModel')}</InputLabel>
                                    <Select
                                        labelId="ai-model-label"
                                        value={request.aiModel || ''}
                                        label={t('aiRecipeGenerator.aiModel')}
                                        onChange={handleModelChange}
                                    >
                                        <MenuItem value="gpt-4">GPT-4</MenuItem>
                                        <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                                        <MenuItem value="gemini-pro">Gemini Pro</MenuItem>
                                    </Select>
                                </FormControl>
                            </GridItem>

                            <GridItem item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label={t('aiRecipeGenerator.maxTokens')}
                                    value={request.maxTokens}
                                    onChange={handleMaxTokensChange}
                                    margin="normal"
                                />
                            </GridItem>

                            <GridItem item xs={12}>
                                <Typography id="temperature-slider" gutterBottom>
                                    {t('aiRecipeGenerator.temperature')}: {request.temperature}
                                </Typography>
                                <Slider
                                    value={request.temperature || 0.7}
                                    onChange={handleTemperatureChange}
                                    aria-labelledby="temperature-slider"
                                    valueLabelDisplay="auto"
                                    step={0.1}
                                    marks
                                    min={0}
                                    max={1}
                                />
                                <Typography variant="caption" color="textSecondary">
                                    {t('aiRecipeGenerator.temperatureHint')}
                                </Typography>
                            </GridItem>

                            <GridItem item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={request.includePreferences === true}
                                            onChange={handleSwitchChange('includePreferences')}
                                            color="primary"
                                        />
                                    }
                                    label={t('aiRecipeGenerator.includePreferences')}
                                />
                            </GridItem>

                            <GridItem item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={request.includeDietaryRestrictions === true}
                                            onChange={handleSwitchChange('includeDietaryRestrictions')}
                                            color="primary"
                                        />
                                    }
                                    label={t('aiRecipeGenerator.includeDietaryRestrictions')}
                                />
                            </GridItem>
                        </GridContainer>

                        {generationError && (
                            <Alert severity="error" sx={{ mt: 3 }}>
                                {generationError}
                            </Alert>
                        )}

                        <Box sx={{ mt: 3, textAlign: 'right' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleGenerate}
                                disabled={loading || !request.prompt}
                            >
                                {loading ? <CircularProgress size={24} /> : t('aiRecipeGenerator.generateButton')}
                            </Button>
                        </Box>
                    </Paper>
                )}

                {activeStep === 1 && (
                    <>
                        {renderGenerationStats()}
                        {renderRecipeResult()}
                    </>
                )}
            </Box>
        </Container>
    );
};

export default AiRecipeGenerator;
