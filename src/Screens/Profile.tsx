import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert, colors } from '@mui/material';

const Profile: React.FC = () => {
    const [username, setUsername] = useState('');

    return (
        <Box >
            <Typography variant="h4" sx={{ textAlign: 'left', marginBottom: 2, marginLeft: 2  }}>Welcome </Typography>

            {/* Profile section */}

            {/* Logout button */}
            <Box mt={2} textAlign="center">
                <Button
                    variant="contained"
                    color="error"
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );
};

export default Profile;