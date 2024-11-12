import React from 'react';
import { Box, Typography, Paper, Button, Grid2, Checkbox } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { events, tasks } from '../Data';

export interface HomeProps {
    navigateToLogin: () => void;
    navigateToTask: (taskId: string) => void; 
}


const Home: React.FC<HomeProps> = ({ navigateToLogin, navigateToTask }) => {

    // Filter tasks to exclude those with due dates in the past
    const filteredTasks = tasks.filter(task => {
        const taskDueDate = new Date(task.dueDate);
        const currentDate = new Date();
        return taskDueDate >= currentDate && !task.isCompleted;
    });

    // Filter events to exclude those with due dates in the past
    const filteredEvents = events.filter(event => {
        if (!event.date) {
            return true;
        }
        const eventDate = new Date(event.date);
        const currentDate = new Date();
        return eventDate >= currentDate;
    });

    return (
        <Box>
            {/* Upcoming events section */}
            <Typography variant="h4" sx={{ textAlign: 'left', marginBottom: 2, marginLeft: 2  }}>Upcoming Events</Typography>
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
                                sx={{ color: event.hasGeneratedList ? 'green' : 'darkgray' }} 
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
                            <Typography>{task.event}: {task.name}</Typography>
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
                                onClick={() => navigateToTask(task.id)}
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

export default Home;
