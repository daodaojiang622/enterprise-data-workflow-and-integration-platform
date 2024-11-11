import React from 'react';
import { Box, Typography, Paper, Button, Grid2, Checkbox } from '@mui/material';
import { alignProperty } from '@mui/material/styles/cssUtils';

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
};

const Home: React.FC<HomeProps> = ({ navigateToLogin }) => {

    // Sample data - in a real app, this would likely come from props or an API
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
        }
    ];

    const taks: TaskSchemaCommentJoin[] = [
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
            dueDate: '12/12/2024'
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
            dueDate: '01/01/2025'
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
            dueDate: '01/12/2024'
        }
    ];

    return (
        <Box>
            {/* Upcoming events section */}
            <Typography variant="h4" sx={{ textAlign: 'left', marginBottom: 2  }}>Upcoming Events</Typography>
            <Paper sx={{ p: 2 }}>
                {events.map((event) => (
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
                            <Checkbox
                                checked={event.hasGeneratedList}
                                readOnly
                                size="small"
                                indeterminate={event.isIndeterminate}
                            />
                            <Typography>{event.title}</Typography>
                        </Box>

                        {/* Date */}
                        <Typography sx={{ width: '25%', textAlign: 'center' }}>
                            {event.date}
                        </Typography>

                        {/* List Button */}
                        <Box sx={{ width: '25%', textAlign: 'right' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    px: 2,
                                    py: 0.5,
                                    backgroundColor: event.isIndeterminate ? 'gray' : 'red',
                                    color: event.isIndeterminate ? 'black' : 'white',
                                    ':hover': {
                                        backgroundColor: event.isIndeterminate ? 'darkgray' : 'darkred'
                                    }
                                }}
                            >
                                List
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Paper>

            {/* Upcoming Tasks section */}
            <Typography variant="h4" sx={{ textAlign: 'left', margin: 2  }}>Upcoming Tasks</Typography>
            <Paper sx={{ p: 2 }}>
                {events.map((event) => (
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
                        <Checkbox
                                checked={event.hasGeneratedList}
                                readOnly
                                size="small"
                                indeterminate={event.isIndeterminate}
                            />
                            <Typography>{event.title}</Typography>
                        </Box>

                        {/* Date */}
                        <Typography sx={{ width: '25%', textAlign: 'center' }}>
                            {event.date}
                        </Typography>

                        {/* List Button */}
                        <Box sx={{ width: '25%', textAlign: 'right' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    px: 2,
                                    py: 0.5,
                                    backgroundColor: event.isIndeterminate ? 'gray' : 'red',
                                    color: event.isIndeterminate ? 'black' : 'white',
                                    ':hover': {
                                        backgroundColor: event.isIndeterminate ? 'darkgray' : 'darkred'
                                    }
                                }}
                            >
                                List
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
