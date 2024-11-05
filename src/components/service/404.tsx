import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from '../../translation/i18n';
import './404.scss';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

export default function Page404 () {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = t("titles.error404");
    });
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '600px'
            }}
        >
        <Typography variant="h3" style={{ color: 'yellowgreen' }}>
            { t("titles.error404") }
        </Typography>
        <Button onClick={() => navigate("/profile")} variant="contained">{ t("titles.profilePage") }</Button>
    </Box>
    );
}