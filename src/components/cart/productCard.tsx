import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Laptop, Add, Remove } from '@material-ui/icons';
import {Button, Checkbox, Stack} from '@mui/material';
const productCard = () => {
    return (
        <Card sx={{ maxWidth: 800, boxShadow: 'none', backgroundColor: 'whitesmoke' }}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Checkbox sx={{ alignSelf: 'flex-start' }} defaultChecked />
                <CardMedia style={ { display: "flex",  alignItems: 'flex-start' } } >
                    <Laptop color="primary" style={ { width: "100px", height: "100px", } } />
                </CardMedia>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="body1">
                        ASUS ZenBook 14
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        1 шт. синий
                    </Typography>
                </CardContent>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="body1">
                       40 000 {"\u20BD"}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ minWidth: 0, padding: '3px 5px' }}
                        >
                            <Add fontSize="small" />
                        </Button>
                        <Typography variant="body1">1</Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ minWidth: 0, padding: '3px 5px' }}
                        >
                            <Remove fontSize="small" />
                        </Button>
                    </Box>
                </CardContent>
            </Stack>
        </Card>
    );
};

export default productCard;
