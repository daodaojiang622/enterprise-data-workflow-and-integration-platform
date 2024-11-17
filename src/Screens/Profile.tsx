import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert, colors } from '@mui/material';


interface ProfileProps {
    logout: () => void;
    username: string;
}

const Profile: React.FC<ProfileProps> = ({logout, username}) => {


    return (
        <Box >
            <Typography variant="h4" sx={{ textAlign: 'left', marginBottom: 2, marginLeft: 2  }}>Welcome {username}</Typography>

            {/* Profile section */}

            {/* Logout button */}
            <Box mt={2} textAlign="center">
                <Button
                    onClick={() => {
                        sessionStorage.removeItem('5500user')
                        logout();
                    }}
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