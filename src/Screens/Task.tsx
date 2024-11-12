import React, { useState } from 'react';
import { Button, List, ListItem, ListItemText, Paper, Box, Typography, Grid2, Divider, TextField } from '@mui/material';

export interface Event {
    id: string;
    name: string;
    date: string;
    typeOfCancer: string;
    description: string;
    region: string;
    particularTopic: string;
  }


const Task: React.FC<TaskProps> = ({ headers, data }) => {
    const [events, setEvents] = useState<Event[]> ([
        { id: '1', name: 'Event A', date: '2024-03-20', typeOfCancer: 'Lung', description: 'Description A', region: 'West', particularTopic: 'Research' },
        { id: '2', name: 'Event B', date: '2024-03-21', typeOfCancer: 'Breast', description: 'Description B', region: 'East', particularTopic: 'Treatment' },
        { id: '3', name: 'Event C', date: '2024-03-22', typeOfCancer: 'Skin', description: 'Description C', region: 'North', particularTopic: 'Prevention' },
      ]);

    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableEvent, setEditableEvent] = useState<Event | null>(null);

    const handleEventSelect = (event: Event) => {
        setSelectedEvent(event);
        setIsEditing(false);
    };

    const handleDelete = () => {
    if (selectedEvent) {
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        setSelectedEvent(null);
    }
    };

    const handleEdit = () => {
    // Implement edit functionality
    if (selectedEvent) {
        setEditableEvent(selectedEvent);
        setIsEditing(true);
        console.log('Edit event:', selectedEvent);
    } else {
        console.log('No event selected for editing');
    }
    };

    const handleCreate = () => {
        // Implement create functionality
        setEditableEvent({id: '', name: '', date: '', typeOfCancer: '', description: '', region: '', particularTopic: ''});
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableEvent(prevEvent => prevEvent ? { ...prevEvent, [name]: value } : null);
    };

    const handleSave = () => {
        if (editableEvent) {
            if (editableEvent.id) {
                // Edit event
                const updatedEvents = events.map(event => event.id === editableEvent.id ? editableEvent : event);
                setEvents(updatedEvents);
            } else {
                // Create new event
                setEvents([...events, { ...editableEvent, id: Date.now().toString() }]);
            }
            setSelectedEvent(editableEvent);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditableEvent(null);
    };

    const handleGenerateList = () => {
    // Implement list generation functionality
    console.log('Generate list for event:', selectedEvent);
    if (selectedEvent) {
        const eventList = events.filter(event => event.id === selectedEvent.id);
        console.log('Generated list:', eventList);
    } else {
        console.log('No event selected for list generation');
    }
    };
    
    return (
        <Box p={2}>
          <Grid2 container spacing={2}>

            {/* Left Panel - Events List */}
            <Grid2 item xs={4}>
                <Typography variant="h6" gutterBottom>
                    Tasks
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
                    onClick={handleCreate}
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
                    {selectedEvent && !isEditing && (
                        <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        >
                        Delete
                        </Button>
                    )}
                    </Box>
                
                {isEditing ? (
                    <Box>
                        <Grid2 container spacing={2}>
                        <Grid2 item xs={6}>
                            <TextField
                                label="Name"
                                name="name"
                                value={editableEvent?.name || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Date"
                                name="date"
                                value={editableEvent?.date || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Type of Cancer"
                                name="typeOfCancer"
                                value={editableEvent?.typeOfCancer || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={editableEvent?.description || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid2>

                        <Grid2 item xs={6}>
                            <TextField
                                label="Region"
                                name="Region"
                                value={editableEvent?.region || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Particular Topic"
                                name="particularTopic"
                                value={editableEvent?.particularTopic || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid2>
                        </Grid2>

                        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
                        <Button variant="contained" onClick={handleSave}>
                            Save
                        </Button>
                        <Button variant="contained" onClick={handleCancel}>
                            Cancel
                        </Button>
                        </Box>
                    </Box>
                ) : ( selectedEvent ? (
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
                    )
                )}
                </Paper>
            </Grid2>    
        
        </Grid2>    
    </Box>
    );
};

// Export the EventTable component as the default export of this module
export default Task;