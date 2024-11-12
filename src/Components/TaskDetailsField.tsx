import { Box, Typography, Divider } from '@mui/material';

interface TaskDetailsFieldProps {
    label: string;
    value: string;
}

const TaskDetailsField = ({ label, value }: TaskDetailsFieldProps) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ color: '#905aa7', fontWeight: 'bold' }}>{label}</Typography>
        <Typography>{value}</Typography>
    </Box>
);

export default TaskDetailsField;