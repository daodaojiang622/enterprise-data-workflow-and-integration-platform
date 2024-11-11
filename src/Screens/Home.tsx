import React, { useState } from 'react';
import { Box, Typography, Button, colors } from '@mui/material';

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
  
interface Task {
id: string;
title: string;
completed: boolean;
}

const Home: React.FC<HomeProps> = ({ navigateToLogin }) => {

    // Sample data - in a real app, this would likely come from props or an API
    const events: Event[] = [
        {
        id: '1',
        title: 'Upcoming Event A',
        date: 'MM/DD/YYYY',
        hasGeneratedList: false
        },
        {
        id: '2',
        title: 'Upcoming Event B',
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

    const tasks: Task[] = [
        {
        id: '1',
        title: 'To be completed',
        completed: false
        },
        {
        id: '2',
        title: 'Completed',
        completed: true
        }
    ];

    return (
        <Box p={2}>
            <>
                <Typography variant="h4" gutterBottom>
                    Welcome to the System
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Exclusive For BC Cancer
                </Typography>
            </>
        </Box>
    );
}

// Export the Home component as the default export of this module
export default Home;