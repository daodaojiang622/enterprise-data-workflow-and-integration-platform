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

const Home: React.FC<HomeProps> = ({ navigateToLogin }) => {

    // Sample data - in a real app, this would likely come from props or an API
    const events: Event[] = [
        {
            id: '1',
            title: 'Upcoming Event A (no lists)',
            date: 'MM/DD/YYYY',
            hasGeneratedList: false
        },
        {
            id: '2',
            title: 'Upcoming Event B (list generated)',
            date: 'MM/DD/YYYY',
            hasGeneratedList: true
        },
        {
            id: '3',
            title: 'Indeterminate Event',
            date: '--/--/---',
            hasGeneratedList: false,
            isIndeterminate: true
        }
    ];

    return (
        <Box>
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
        </Box>
    );
}

// Export the Home component as the default export of this module
export default Home;
