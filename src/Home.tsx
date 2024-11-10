import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, TextField } from '@mui/material';


function Home() {

    return (
        <Box p={2}>
            <Typography variant="h4" gutterBottom>
                Welcome to the Event List Generator and Task Management System
            </Typography>
            <Typography variant="body1" gutterBottom>
                Exclusive For BC Cancer
            </Typography>
        </Box>
    );
}

// Export the DonorTable component as the default export of this module
export default Home;