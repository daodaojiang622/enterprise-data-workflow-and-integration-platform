import React, { useState } from 'react';
import { Box, Typography, Button, colors } from '@mui/material';

interface HomeProps {
    navigateToLogin: () => void;
}

const Home: React.FC<HomeProps> = ({ navigateToLogin }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Box p={2}>
            {isLoggedIn ? (
                <>
                    <Typography variant="h4" gutterBottom>
                        Welcome to the Event List Generator and Task Management System
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Exclusive For BC Cancer
                    </Typography>
                </>
            ) : (
                <>
                    <Typography variant="h5" gutterBottom>
                        Please log in to access the System
                    </Typography>
                    <Button variant="contained" sx={{ marginTop: 5, backgroundColor: '#36a0c8', color: 'white' }} onClick={navigateToLogin}>
                        Login
                    </Button>
                </>
            )}
        </Box>
    );
}

// Export the Home component as the default export of this module
export default Home;