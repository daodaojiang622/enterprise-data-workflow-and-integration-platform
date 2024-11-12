import { Box, Button, TextField, Grid2 } from '@mui/material';

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
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSave: () => void;
    handleCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ editableTask, handleInputChange, handleSave, handleCancel }) => (
    <Box>
        <Grid2>
            <TextField label="Name*" name="name" value={editableTask?.name || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Event*" name="event" value={editableTask?.event || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Due Date*" name="dueDate" value={editableTask?.dueDate || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Description*" name="description" value={editableTask?.description || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Comment" name="comment" value={editableTask?.comment || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Approver 1*" name="approver1" value={editableTask?.approver1 || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Approver 2" name="approver2" value={editableTask?.approver2 || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Approver 3" name="approver3" value={editableTask?.approver3 || ''} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Assign to*" name="assignee" value={editableTask?.assignee || ''} onChange={handleInputChange} fullWidth margin="normal" />
        </Grid2>
    </Box>
);

export default TaskForm;
