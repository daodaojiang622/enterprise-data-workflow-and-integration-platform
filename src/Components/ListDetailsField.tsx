import { Box, Typography } from '@mui/material';

interface ListDetailsFieldProps {
    label: string;
    value: string;
}

const ListDetailsField = ({ label, value }: ListDetailsFieldProps) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ color: '#905aa7', fontWeight: 'bold' }}>{label}</Typography>
        <Typography>{value}</Typography>
    </Box>
);

export default ListDetailsField;