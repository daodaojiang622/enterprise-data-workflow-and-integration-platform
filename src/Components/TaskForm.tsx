import React from 'react';
import { Box, Button, TextField, Select, MenuItem, Grid2 } from '@mui/material';
import { events } from '../Data';

interface TaskFormProps {
    editableTask: {
        name?: string;
        event?: string;
        dueDate?: string;
        description?: string;
        comment?: string;
        approver1?: string;
        approver2?: string;
        approver3?: string;
        assignee?: string;
    };
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
    handleSave: () => void;
    handleCancel: () => void;
}

const futureEvents = events.filter(event => {
    if (!event.date) {
        return true;
    }
    const eventDate = new Date(event.date);
    const currentDate = new Date();
    return eventDate >= currentDate;
});

const TaskForm: React.FC<TaskFormProps> = ({ editableTask, handleInputChange, handleSave, handleCancel }) => (
    <Box>
        <Grid2>
            <TextField label="Task Name*" name="name" value={editableTask?.name || ''} onChange={handleInputChange} fullWidth margin="normal" />
            
            {/* Event Dropdown */}
            <Select
                label="Event*"
                name="event"
                value={editableTask?.event || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                displayEmpty
            > 
                <MenuItem value="" disabled >Select an event</MenuItem>
                {futureEvents.map((event) => (
                    <MenuItem key={event.id} value={event.title}>
                        {event.title}
                    </MenuItem>
                ))}
            </Select>
            
            <TextField label="Due Date*" name="dueDate" value={editableTask?.dueDate || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Description*" name="description" value={editableTask?.description || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Comment" name="comment" value={editableTask?.comment || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Approver 1*" name="approver1" value={editableTask?.approver1 || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Approver 2" name="approver2" value={editableTask?.approver2 || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Approver 3" name="approver3" value={editableTask?.approver3 || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Assign to*" name="assignee" value={editableTask?.assignee || ''} onChange={handleInputChange} fullWidth margin="normal" />
        </Grid2>

        <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
        </Box>
    </Box>
);

export default TaskForm;
