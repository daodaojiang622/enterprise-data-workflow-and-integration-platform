import React, { useState } from 'react';
import { Box, Button, Typography, Tabs, Tab, TextField } from '@mui/material';
import UserLogin from './UserLogin';
import Home from './Home';
import Event from './Event';
import Task from './Task';
import Profile from './Profile';

/**
 * The ControlPanel component is the main component that manages the state and logic
 * for displaying different tabs and their respective content.
 * 
 * @returns {JSX.Element} The JSX code to render the ControlPanel component.
 */
const ControlPanel: React.FC = () => {
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [data, setData] = useState<(string | number)[][]>([]);
    const [limit, setLimit] = useState<number>(1);
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Change to false when submitting!!!
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null); 

    /**
     * Handles the selection and deselection of cities.
     * 
     * @param {string} name - The name of the city to select or deselect.
     */
    const handleSelectCity = (name: string) => {
        setSelectedCities((prevSelected) =>
            prevSelected.includes(name)
                ? prevSelected.filter((cityName) => cityName !== name)
                : [...prevSelected, name]
        );
    };

    /**
     * Fetches event data based on the selected cities and limit.
     */
    const handleGetEvents = () => {
        // Construct query parameters from the selected cities and limit
        const queryParams = selectedCities.map(city => `cities=${encodeURIComponent(city)}`).join('&');
        const url = `https://bc-cancer-faux.onrender.com/event?${queryParams}&limit=${limit}&format=json`;

        // Fetch event data from the API
        fetch(url)
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                // Update the state with the fetched headers and data
                setHeaders(data.headers);
                setData(data.data);
                console.log('Fetched events:', data);
            })
            .catch(error => console.error('Error fetching events:', error)); // Log any errors
    };

    /**
     * Handles the change in the limit input field.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input field.
     */
    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newLimit = Number(event.target.value);
        if (newLimit < 1) {
            newLimit = 1;
        }
        setLimit(Number(newLimit));
    };

    /**
     * Handles the change of the selected tab.
     * 
     * @param {React.ChangeEvent<{}>} _event - The change event from the tab component.
     * @param {number} newValue - The index of the newly selected tab.
     */
    const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    const navigateToLogin = () => {
        setTabIndex(5); // Assuming the login/logout tab is at index 5
    };

    const navigateToTask = (taskId: string) => {
        setSelectedTaskId(taskId); // Set the selected task ID
        setTabIndex(2); // Navigate to the Task tab (assuming Task is at index 2)
        console.log('Navigating to task:', taskId);
    };

    return (
        <Box p={2} position="absolute" top={0} left={0} mt={2} width="100%">

            {/* Tabs component to switch between different views */}
            {isLoggedIn? (
                <Tabs 
                value={tabIndex} 
                onChange={handleTabChange} 
                aria-label="Event Panel Tabs"
                TabIndicatorProps={{
                    style: {
                        backgroundColor: '#905aa7'
                    }
                }}
            >
                <Tab label="Home" style={StyleSheet.tab} />
                <Tab label="Events" style={StyleSheet.tab} />
                <Tab label="Tasks" style={StyleSheet.tab} />
                <Tab label="My Profile" style={StyleSheet.tab} />
            </Tabs>
            ) : (
                <Box p={2} position="absolute" top={100} left={0} mt={2} width="100%">
                    <Typography 
                        variant="h4" 
                        gutterBottom 
                        align="center" 
                        sx={{ color: "#905aa7", padding: '8px' }}
                    >
                        Please Log In to Continue
                    </Typography>
                    <Box mt={4}>
                        <UserLogin setIsLoggedIn={setIsLoggedIn} />
                    </Box>
                </Box>
            )}

            {/* Render the content based on the selected tab */}
            {isLoggedIn && tabIndex === 0 && (
                <Box mt={4}>
                    <Home navigateToLogin={navigateToLogin} navigateToTask={navigateToTask} />
                </Box>
            )}

            {isLoggedIn && tabIndex === 1 && (
                <Box mt={4}>
                    <Event headers={headers} data={data}/>
                </Box>
            )}

            {isLoggedIn && tabIndex === 2 && (
                <Box mt={4}>
                    <Task selectedTaskId={selectedTaskId}/>
                </Box>
            )}

            {isLoggedIn && tabIndex === 3 && (
                <Box mt={4}>
                    <Profile />
                </Box>
            )}


        </Box>
    )
}

const StyleSheet = {
    tab: {
        color: '#36a0c8',
        fontWeight: 'bold'
    }
}

// Export the ControlPanel component as the default export of this module
export default ControlPanel;