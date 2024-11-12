import { ListItem, ListItemText } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { listItemStyle } from '../Utils/Style';

interface Event {
    name: string;
    isCompleted: boolean;
}

interface EventListItemProps {
    task: Task;
    isSelected: boolean;
    onSelect: (task: Task) => void;
}

const EventListItem: React.FC<EventListItemProps> = ({ task, isSelected, onSelect }) => (
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

export default EventListItem;
