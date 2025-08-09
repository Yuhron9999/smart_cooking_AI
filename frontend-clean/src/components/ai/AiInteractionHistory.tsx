import React, { useState, useEffect, useContext } from 'react';
import {
    Container, Box, Typography, Paper, TextField, Button,
    CircularProgress, Card, CardContent, Chip, Pagination,
    InputAdornment, IconButton, Tabs, Tab, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AuthContext } from '../../contexts/AuthContext';
import { useSmartCookingApi } from '../../hooks/useSmartCookingApi';
import { useTranslation } from 'react-i18next';
import { UserAiInteraction, AiType } from '../../types/api';
import { format, parseISO } from 'date-fns';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`ai-history-tabpanel-${index}`}
            aria-labelledby={`ai-history-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

const AiInteractionHistory: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation('common');
    const {
        getUserAiInteractions,
        searchAiInteractions,
        getAiInteractionStats,
        loading,
        error
    } = useSmartCookingApi();

    const [interactions, setInteractions] = useState<UserAiInteraction[]>([]);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [tabValue, setTabValue] = useState<number>(0);
    const [stats, setStats] = useState<{
        totalExecutionTimeMs: number;
        totalTokensUsed: number;
    }>({ totalExecutionTimeMs: 0, totalTokensUsed: 0 });

    const [selectedInteraction, setSelectedInteraction] = useState<UserAiInteraction | null>(null);
    const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

    // Tải tương tác khi component được mount
    useEffect(() => {
        if (user && user.id) {
            loadInteractions();
            loadStats();
        }
    }, [user, page]);

    // Tải tương tác từ API
    const loadInteractions = async (): Promise<void> => {
        if (!user || !user.id) return;

        try {
            const result = await getUserAiInteractions(user.id, page, 10);
            setInteractions(result.content);
            setTotalPages(result.totalPages);
        } catch (err) {
            console.error('Error loading AI interactions:', err);
        }
    };

    // Tải thống kê từ API
    const loadStats = async (): Promise<void> => {
        if (!user || !user.id) return;

        try {
            const statsData = await getAiInteractionStats(user.id);
            setStats(statsData);
        } catch (err) {
            console.error('Error loading AI stats:', err);
        }
    };

    // Xử lý tìm kiếm
    const handleSearch = async (): Promise<void> => {
        if (!user || !user.id || !searchQuery) return;

        try {
            const results = await searchAiInteractions(user.id, searchQuery);
            setInteractions(results);
            setTotalPages(1); // Kết quả tìm kiếm không phân trang
        } catch (err) {
            console.error('Error searching AI interactions:', err);
        }
    };

    // Xử lý thay đổi trang
    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number): void => {
        setPage(newPage - 1); // API uses 0-indexed pages
    };

    // Xử lý thay đổi tab
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
        setTabValue(newValue);
    };

    // Xử lý hiển thị chi tiết tương tác
    const handleOpenDetails = (interaction: UserAiInteraction): void => {
        setSelectedInteraction(interaction);
        setDetailsOpen(true);
    };

    // Đóng dialog chi tiết
    const handleCloseDetails = (): void => {
        setDetailsOpen(false);
    };

    // Hiển thị loại AI dưới dạng chip
    const renderAiTypeChip = (type: AiType): React.ReactNode => {
        const colors: Record<AiType, 'primary' | 'secondary' | 'success' | 'info'> = {
            [AiType.GPT]: 'primary',
            [AiType.GEMINI]: 'secondary',
            [AiType.VOICE]: 'success',
            [AiType.VISION]: 'info'
        };

        return (
            <Chip
                label={type}
                color={colors[type]}
                size="small"
                variant="outlined"
            />
        );
    };

    // Format timestamp
    const formatTimestamp = (timestamp: string | undefined): string => {
        if (!timestamp) return 'N/A';
        try {
            return format(parseISO(timestamp), 'dd/MM/yyyy HH:mm:ss');
        } catch (e) {
            return 'Invalid date';
        }
    };

    // Truncate text
    const truncateText = (text: string, maxLength: number): string => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    if (!user) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h4">{t('aiHistory.pleaseLogin')}</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('aiHistory.title')}
                </Typography>

                <Paper sx={{ p: 2, mb: 4 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ flex: { xs: '100%', md: '1 1 48%' } }}>
                            <TextField
                                fullWidth
                                placeholder={t('aiHistory.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleSearch} edge="end">
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleSearch();
                                }}
                            />
                        </Box>
                        <Box sx={{ flex: { xs: '100%', md: '1 1 48%' } }}>
                            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                <Button
                                    variant="outlined"
                                    onClick={loadInteractions}
                                >
                                    {t('aiHistory.reset')}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    <Box sx={{ flex: { xs: '100%', md: '1 1 33%' } }}>
                        {/* Thống kê */}
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                {t('aiHistory.stats')}
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 48%' }}>
                                    <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                        <CardContent>
                                            <Typography variant="body2">{t('aiHistory.totalInteractions')}</Typography>
                                            <Typography variant="h4">{interactions.length}</Typography>
                                        </CardContent>
                                    </Card>
                                </Box>

                                <Box sx={{ flex: '1 1 48%' }}>
                                    <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                                        <CardContent>
                                            <Typography variant="body2">{t('aiHistory.totalTokens')}</Typography>
                                            <Typography variant="h4">{stats.totalTokensUsed || 0}</Typography>
                                        </CardContent>
                                    </Card>
                                </Box>

                                <Box sx={{ flex: '1 1 100%' }}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="body2">{t('aiHistory.totalProcessingTime')}</Typography>
                                            <Typography variant="h5">
                                                {stats.totalExecutionTimeMs ? `${(stats.totalExecutionTimeMs / 1000).toFixed(2)}s` : '0s'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>

                    <Box sx={{ flex: { xs: '100%', md: '1 1 65%' } }}>
                        <Paper sx={{ p: 2 }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label="ai interaction tabs"
                                variant="fullWidth"
                            >
                                <Tab label={t('aiHistory.allInteractions')} />
                                <Tab label={t('aiHistory.byDate')} />
                                <Tab label={t('aiHistory.byAiType')} />
                            </Tabs>

                            <TabPanel value={tabValue} index={0}>
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>{t('aiHistory.type')}</TableCell>
                                                        <TableCell>{t('aiHistory.input')}</TableCell>
                                                        <TableCell>{t('aiHistory.time')}</TableCell>
                                                        <TableCell>{t('aiHistory.actions')}</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {interactions.length > 0 ? (
                                                        interactions.map((interaction) => (
                                                            <TableRow key={interaction.id} hover>
                                                                <TableCell>
                                                                    {renderAiTypeChip(interaction.aiType)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {truncateText(interaction.input, 50)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatTimestamp(interaction.createdAt)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleOpenDetails(interaction)}
                                                                        title={t('common.view')}
                                                                    >
                                                                        <VisibilityIcon fontSize="small" />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        size="small"
                                                                        color="error"
                                                                        title={t('common.delete')}
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={4} align="center">
                                                                <Typography variant="body2" color="textSecondary">
                                                                    {t('aiHistory.noData')}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        {totalPages > 1 && (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                                <Pagination
                                                    count={totalPages}
                                                    page={page + 1}
                                                    onChange={handlePageChange}
                                                    color="primary"
                                                />
                                            </Box>
                                        )}
                                    </>
                                )}
                            </TabPanel>

                            <TabPanel value={tabValue} index={1}>
                                <Typography variant="body1">
                                    {t('aiHistory.byDateContent')}
                                </Typography>
                                {/* Hiển thị tương tác theo ngày ở đây */}
                            </TabPanel>

                            <TabPanel value={tabValue} index={2}>
                                <Typography variant="body1">
                                    {t('aiHistory.byAiTypeContent')}
                                </Typography>
                                {/* Hiển thị tương tác theo loại AI ở đây */}
                            </TabPanel>
                        </Paper>
                    </Box>
                </Box>

                {/* Dialog hiển thị chi tiết tương tác */}
                <Dialog
                    open={detailsOpen}
                    onClose={handleCloseDetails}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        {t('aiHistory.interactionDetails')}
                        {selectedInteraction && (
                            <Chip
                                label={selectedInteraction.aiType}
                                color="primary"
                                size="small"
                                sx={{ ml: 2 }}
                            />
                        )}
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedInteraction && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t('aiHistory.timestamp')}:
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatTimestamp(selectedInteraction.createdAt)}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t('aiHistory.input')}:
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {selectedInteraction.input}
                                        </Typography>
                                    </Paper>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {t('aiHistory.output')}:
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f0f7ff' }}>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {selectedInteraction.output}
                                        </Typography>
                                    </Paper>
                                </Box>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ flex: '1 1 30%', minWidth: '150px' }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {t('aiHistory.executionTime')}:
                                        </Typography>
                                        <Typography variant="body2">
                                            {selectedInteraction.executionTimeMs ?
                                                `${(selectedInteraction.executionTimeMs / 1000).toFixed(2)}s` :
                                                'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ flex: '1 1 30%', minWidth: '150px' }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {t('aiHistory.tokensUsed')}:
                                        </Typography>
                                        <Typography variant="body2">
                                            {selectedInteraction.tokensUsed || 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ flex: '1 1 30%', minWidth: '150px' }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {t('aiHistory.cost')}:
                                        </Typography>
                                        <Typography variant="body2">
                                            {selectedInteraction.costUsd ?
                                                `$${selectedInteraction.costUsd.toFixed(4)}` :
                                                'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDetails}>
                            {t('common.close')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default AiInteractionHistory;
