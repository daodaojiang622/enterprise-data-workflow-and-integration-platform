import { ListItem, ListItemText } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { listItemStyle } from '../Utils/Style';

interface Event {
    title: string;
    hasGeneratedList: boolean;
}

interface EventListItemProps {
    event: Event;
    isSelected: boolean;
    onSelect: (event: Event) => void;
}

const EventListItem: React.FC<EventListItemProps> = ({ task, isSelected, onSelect }) => (
    <ListItem
        button
        selected={isSelected}
        onClick={() => onSelect(task)}
        sx={listItemStyle}
    >
        <ListItemText
            primary={task.title}
            sx={{
                color: isSelected ? 'purple' : 'inherit',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
            }}
        />
        <ListAltIcon
            sx={{
                color: task.hasGeneratedList ? 'green' : 'darkgray',
                marginLeft: 1,
                fontSize: 18,
            }}
        />
    </ListItem>
);

export default EventListItem;