import React from 'react';
import { Box, Typography, Paper, Button, Grid2, Checkbox } from '@mui/material';
import { alignProperty } from '@mui/material/styles/cssUtils';
import ListAltIcon from '@mui/icons-material/ListAlt';

interface HomeProps {
    navigateToLogin: () => void;
}

interface Event {
    id: string;
    title: string;
    date: string;
    hasGeneratedList: boolean;
    isIndeterminate?: boolean;
}

interface TaskSchemaCommentJoin {
    id: string,
    taskName: string,
    approver1: string,
    approver2: string,
    approver3: string,
    taskDescription: string,
    recommendation: string,
    decisionMaker: string,
    commentId: number,
    comment: string,
    user: string,
    dueDate: string,
    Event: string,
};

const Home: React.FC<HomeProps> = ({ navigateToLogin }) => {

    // Sample data
    const events: Event[] = [
        {
            id: '1',
            title: 'Event A (no lists)',
            date: '12/12/2024',
            hasGeneratedList: false
        },
        {
            id: '2',
            title: 'Event B (list generated)',
            date: '01/01/2025',
            hasGeneratedList: true
        },
        {
            id: '3',
            title: 'Event C',
            date: '--/--/---',
            hasGeneratedList: false,
            isIndeterminate: true
        },
        {
            id: '4',
            title: 'Event D (list generated)',
            date: '01/01/2023',
            hasGeneratedList: true
        },
        {
            id: '5',
            title: 'Event E (list generated)',
            date: '01/01/2025',
            hasGeneratedList: true
        },
    ];

    const tasks: TaskSchemaCommentJoin[] = [
        {
            id: '1',
            taskName: 'Task1',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            taskDescription: 'We need to do this task',
            recommendation: 'We recommend this',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: 'we cant do this',
            user: 'MeowMeow',
            dueDate: '12/12/2024',
            Event: 'Event A'
        },
        {
            id: '2',
            taskName: 'Task2',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: '',
            taskDescription: 'We need to do this task',
            recommendation: 'We recommend this',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: '',
            user: 'MeowMeow',
            dueDate: '01/01/2025',
            Event: 'Event B'
        },
        {
            id: '3',
            taskName: 'Task3',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            taskDescription: 'We need to do this task',
            recommendation: 'We recommend this',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: 'Yes we can',
            user: 'MeowMeow',
            dueDate: '01/12/2024',
            Event: 'Event C'
        },
        {
            id: '4',
            taskName: 'Task4',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            taskDescription: 'We need to do this task',
            recommendation: 'We recommend this',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: 'Yes we can',
            user: 'MeowMeow',
            dueDate: '01/12/2025',
            Event: 'Event A'
        },
        {
            id: '5',
            taskName: 'Task5',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            taskDescription: 'We need to do this task',
            recommendation: 'We recommend this',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: 'Yes we can',
            user: 'MeowMeow',
            dueDate: '01/12/2025',
            Event: 'Event A'
        }
    ];

    // Filter tasks to exclude those with due dates in the past
    const filteredTasks = tasks.filter(task => {
        const taskDueDate = new Date(task.dueDate);
        const currentDate = new Date();
        return taskDueDate >= currentDate;
    });

    // Filter events to exclude those with due dates in the past
    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const currentDate = new Date();
        return eventDate >= currentDate;
    });

    return (
        <Box>
            {/* Upcoming events section */}
            <Typography variant="h4" sx={{ textAlign: 'left', marginBottom: 2  }}>Upcoming Events</Typography>
            <Paper sx={{ p: 2, height: '150px', overflow: 'auto' }}>
                {filteredEvents.map((event) => (
                    <Box 
                        key={event.id} 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 1 
                        }}
                    >
                        {/* Title and Checkbox */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '50%' }}>
                            <Typography>{event.title}</Typography>
                            <ListAltIcon 
                                fontSize="small" 
                                sx={{ color: event.hasGeneratedList ? 'green' : 'red' }} 
                            /> 
                        </Box>

                        {/* Date */}
                        <Typography sx={{ width: '15%', textAlign: 'center' }}>
                            {event.date}
                        </Typography>

                        {/* List Button */}
                        <Box sx={{ width: '35%', textAlign: 'right' }}>
                            <Button
                                variant="contained"
                                disableRipple
                                sx={{
                                    backgroundColor: '#36a0c8',
                                    ':hover': {
                                        backgroundColor: '#1e5a70' 
                                    },
                                    ':focus': {
                                        outline: 'none'      // Ensures no outline on focus
                                    }
                                }}
                            >
                                Details
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Paper>

            {/* Upcoming Tasks section */}
            <Typography variant="h4" sx={{ textAlign: 'left', margin: 2  }}>Upcoming Tasks</Typography>
            <Paper sx={{ p: 2, height: '150px', overflow: 'auto'  }}>
                {filteredTasks.map((task) => (
                    <Box 
                        key={task.id} 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 1 
                        }}
                    >
                        {/* Task Name */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '50%' }}>
                            <Typography>{task.Event}: {task.taskName}</Typography>
                        </Box>

                        {/* Date */}
                        <Typography sx={{ width: '15%', textAlign: 'center' }}>
                            {task.dueDate}
                        </Typography>

                        {/* List Button */}
                        <Box sx={{ width: '35%', textAlign: 'right' }}>
                            <Button
                                variant="contained"
                                disableRipple
                                sx={{
                                    backgroundColor: '#36a0c8',
                                    ':hover': {
                                        backgroundColor: '#1e5a70' 
                                    },
                                    ':focus': {
                                        outline: 'none'      // Ensures no outline on focus
                                    }
                                }}
                            >
                                Details
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Paper>
        </Box>
    );
}

// Export the Home component as the default export of this module
export default Home;
