import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';

interface UserLoginProps {
    login: (username: string) => void;
    logout: () => void;
    isLoggedIn: boolean;
}

const UserLogin: React.FC<UserLoginProps> = ({login, isLoggedIn, logout}) => {
    const [username, setUsername] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const storedUsername = sessionStorage.getItem('5500user');
        if (storedUsername) {
            setUsername(storedUsername);
            login(storedUsername);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sessionStorage.setItem('5500user', username);
        setSnackbarMessage(`Username ${username} stored in session storage`);
        setSnackbarOpen(true);
        login(username);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('5500user');
        setUsername('');
        logout();
        setSnackbarMessage('Logged out successfully');
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" p={2} mb={10}>
            {!isLoggedIn ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            label="Username"
                            value={username}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Submit
                        </Button>
                    </form>
                </Box>
            ) : (
                <Button variant="contained" color="secondary" onClick={handleLogout}>
                    Logout
                </Button>
            )}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserLogin;