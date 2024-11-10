import React, { useState } from 'react';
import { Button, List, ListItem, ListItemText, Paper, Box, Typography, Grid2, Divider } from '@mui/material';

export interface Event {
    id: string;
    name: string;
    date: string;
    typeOfCancer: string;
    description: string;
    region: string;
    particularTopic: string;
  }


const EventTable: React.FC<EventTableProps> = ({ headers, data }) => {
    const [events, setEvents] = useState<Event[]> ([
        { id: '1', name: 'Event A', date: '2024-03-20', typeOfCancer: 'Lung', description: 'Description A', region: 'West', particularTopic: 'Research' },
        { id: '2', name: 'Event B', date: '2024-03-21', typeOfCancer: 'Breast', description: 'Description B', region: 'East', particularTopic: 'Treatment' },
        { id: '3', name: 'Event C', date: '2024-03-22', typeOfCancer: 'Skin', description: 'Description C', region: 'North', particularTopic: 'Prevention' },
      ]);

    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    };

    const handleDelete = () => {
    if (selectedEvent) {
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        setSelectedEvent(null);
    }
    };

    const handleEdit = () => {
    // Implement edit functionality
    console.log('Edit event:', selectedEvent);
    };

    const handleCreate = () => {
    // Implement create functionality
    console.log('Create new event');
    };

    const handleGenerateList = () => {
    // Implement list generation functionality
    console.log('Generate list for event:', selectedEvent);
    };
    
    return (
        <Box p={2}>
          <Grid2 container spacing={2}>

            {/* Left Panel - Events List */}
            <Grid2 item xs={4}>
                <Typography variant="h6" gutterBottom>
                    Events
                </Typography>
                    
                <Paper sx={{p: 5, height: "200%" }}>
                    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {events.map((event) => (
                        <ListItem
                            key={event.id}
                            button
                            selected={selectedEvent?.id === event.id}
                            onClick={() => handleEventSelect(event)}
                            sx={{ 
                                '&.Mui-selected': {
                                backgroundColor: '#e3f2fd'
                                }
                            }}
                        >
                            <ListItemText primary={event.name} />
                        </ListItem>
                    ))}
                    </List>
                    <Button
                    variant="contained"
                    // onClick={handleCreate}
                    fullWidth
                    sx={{ mt: 2 }}
                    >
                    Create
                    </Button>
                </Paper>
            </Grid2>
        
            {/* Right Panel - Event Details */}
            <Grid2 item xs={8}>
                <Typography variant="h6">Event Details</Typography>
                <Paper sx={{ p: 2, width: "300%", height:"200%"}}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    {selectedEvent && (
                        <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        >
                        Delete
                        </Button>
                    )}
                    </Box>
            
                {selectedEvent ? (
                <Box>
                    <Grid2 container spacing={2}>
                    <Grid2 item xs={6}>
                        <Typography variant="subtitle2">Name</Typography>
                        <Typography>{selectedEvent.name}</Typography>
                        <Divider sx={{ my: 1 }} />
                        
                        <Typography variant="subtitle2">Date</Typography>
                        <Typography>{selectedEvent.date}</Typography>
                        <Divider sx={{ my: 1 }} />
                        
                        <Typography variant="subtitle2">Type of Cancer</Typography>
                        <Typography>{selectedEvent.typeOfCancer}</Typography>
                        <Divider sx={{ my: 1 }} />
                        
                        <Typography variant="subtitle2">Description</Typography>
                        <Typography>{selectedEvent.description}</Typography>
                    </Grid2>
                    
                    <Grid2 item xs={6}>
                        <Typography variant="subtitle2">ID</Typography>
                        <Typography>{selectedEvent.id}</Typography>
                        <Divider sx={{ my: 1 }} />
                        
                        <Typography variant="subtitle2">Region</Typography>
                        <Typography>{selectedEvent.region}</Typography>
                        <Divider sx={{ my: 1 }} />
                        
                        <Typography variant="subtitle2">Particular Topic</Typography>
                        <Typography>{selectedEvent.particularTopic}</Typography>
                    </Grid2>
                    </Grid2>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
                    <Button variant="contained" onClick={handleEdit}>
                        Edit
                    </Button>
                    <Button variant="contained" onClick={handleGenerateList}>
                        View / Generate List
                    </Button>
                    </Box>
                    </Box>
                    ) : (
                    <Typography color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                        Select an event to view details
                    </Typography>
                    )}
                </Paper>
            </Grid2>    
        
        </Grid2>    
    </Box>
    );
};

// Export the EventTable component as the default export of this module
export default EventTable;