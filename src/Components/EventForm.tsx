import React from 'react';
import { Box, Button, TextField, Select, MenuItem, Grid2 } from '@mui/material';
import { events } from '../Data';

interface TaskFormProps {
    editableEvent: {
        id?: string;
        title?: string;
        date?: string;
        owner?: string;
        typeOfCancer?: string;
        description?: string;
        region?: string;
        particularTopic?: string;
        hasGeneratedList?: boolean;
    };
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement | { title?: string; value: unknown }>) => void;
    handleSave: () => void;
    handleCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ editableEvent, handleInputChange, handleSave, handleCancel }) => (
    <Box>
        <Grid2>
            <TextField label="Event Name:*" name="name" value={editableEvent?.title || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Date: DD/MM/YYYY *" name="Date" value={editableEvent?.date || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Owner*" name="Owner" value={editableEvent?.owner || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Type of Cancer*" name="Type of Cancer" value={editableEvent?.typeOfCancer || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Description*" name="Description" value={editableEvent?.description || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Region*" name="Region" value={editableEvent?.region || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Particular Topic" name="Particular Topic" value={editableEvent?.particularTopic || ''} onChange={handleInputChange} fullWidth margin="normal" />
        </Grid2>

    </Box>
);

export default TaskForm;
