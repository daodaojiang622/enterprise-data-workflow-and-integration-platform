import { ListItem, ListItemText } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { listItemStyle } from '../Utils/Style';

interface Task {
    name: string;
    isCompleted: boolean;
}

interface TaskListItemProps {
    task: Task;
    isSelected: boolean;
    onSelect: (task: Task) => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, isSelected, onSelect }) => (
    <ListItem
        button
        selected={isSelected}
        onClick={() => onSelect(task)}
        sx={listItemStyle}
    >
        <ListItemText
            primary={task.name}
            sx={{
                color: isSelected ? 'purple' : 'inherit',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
            }}
        />
        <TaskAltIcon
            sx={{
                color: task.isCompleted ? 'green' : 'darkgray',
                marginLeft: 1,
                fontSize: 18,
            }}
        />
    </ListItem>
);

export default TaskListItem;
