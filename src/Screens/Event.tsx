import React, { useState, useEffect } from 'react';
import { Button, List, Paper, Box, Typography, Divider, Grid2 } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { boxStyle, buttonStyle, colors } from '../Utils/Style';
import { events as initialEvents } from '../Data';
import EventListItem from '../Components/EventListItem';
import ListDetailsField from '../Components/ListDetailsField';
import EventForm from '../Components/EventForm';

export interface Event {
    id: string;
    title: string;
    date: string;
    owner: string;
    typeOfCancer: string;
    description: string;
    region: string;
    particularTopic: string;
    hasGeneratedList: boolean;
}

interface EventProps {
    selectedEventId: string | null;
    setTabIndex: (index: number) => void;
}

const Event: React.FC<EventProps> = ({ selectedEventId, setTabIndex }) => {
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableEvent, setEditableEvent] = useState<Event | null>(null);

    useEffect(() => {
        if (selectedEventId) {
            const event = events.find((event) => event.id === selectedEventId);
            setSelectedEvent(event || null);
        }
    }, [selectedEventId, events]);

    const handleEventSelect = (event: Event) => {
        console.log('Event selected:', event);
        setSelectedEvent(event);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (selectedEvent) {
            setEvents(events.filter((event) => event.id !== selectedEvent.id));
            setSelectedEvent(null);
        }
    };

    const handleEdit = () => {
        if (selectedEvent) {
            setEditableEvent(selectedEvent);
            setIsEditing(true);
        }
    };

    const handleCreate = () => {
        setSelectedEvent(null);
        setEditableEvent({
            id: '10',
            title: '',
            date: '',
            owner: '',
            hasGeneratedList: false,
            typeOfCancer: '',
            description: '',
            region: '',
            particularTopic: '',
        });
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableEvent((prevEvent) => (prevEvent ? { ...prevEvent, [name]: value } : null));
    };

    const handleSave = () => {
        if (!editableEvent) return;

        if (editableEvent.id) {
            const updatedEvents = events.map((event) =>
                event.id === editableEvent.id ? editableEvent : event
            );
            setEvents(updatedEvents);
        } else {
            setEvents([...events, { ...editableEvent, id: Date.now().toString() }]);
        }
        setSelectedEvent(editableEvent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
            setIsEditing(false);
            setEditableEvent(null);
        }
    };

    const handleList = () => {
        // navigate to the list page
        localStorage.setItem('event', JSON.stringify(selectedEvent));
        setTabIndex(2);
    };

    return (
        <Box p={2}>
            <Grid2 container spacing={2}>
                {/* Left Panel - Events List */}
                <Grid2 item xs={4} ml={5} mr={5}>
                    <Typography variant="h4" gutterBottom>Events</Typography>
                    <Paper sx={{ height: '435px', overflow: 'auto', width: '200px' }}>
                        <List>
                            {events.map((event) => (
                                <EventListItem
                                    key={event.id}
                                    task={event}
                                    isSelected={selectedEvent?.id === event.id}
                                    onSelect={handleEventSelect}
                                />
                            ))}
                        </List>
                    </Paper>
                    <Button variant="contained" onClick={handleCreate} fullWidth sx={{ mt: 5, backgroundColor: colors.primary, ':focus': { outline: 'none' } }}>
                        Create
                    </Button>
                </Grid2>

                {/* Right Panel - Event Details */}
                <Grid2 item xs={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h4">
                            {isEditing ? (selectedEvent ? 'Edit Event' : 'Create Event') : 'Event Details'}
                        </Typography>
                        {selectedEvent && !isEditing && (
                            <Button variant="contained" color="error" onClick={handleDelete} sx={{ ml: 2 }}>
                                <DeleteIcon />
                            </Button>
                        )}
                    </Box>
                    <Paper sx={{ p: 2, height: '400px', overflow: 'auto', width: '800px' }}>
                        {isEditing ? (
                            <EventForm
                                editableEvent={editableEvent}
                                handleInputChange={handleInputChange}
                                handleSave={handleSave}
                                handleCancel={handleCancel}
                            />
                        ) : selectedEvent ? (
                            <Box>
                                {/* Status Bar */}
                                <Box sx={{ backgroundColor: colors.secondaryBackground, padding: 1, mb: 1, borderRadius: 2 }}>
                                <Typography sx={{ color: selectedEvent.hasGeneratedList ? 'green' : 'red', fontWeight: 'bold'}}>
                                    {selectedEvent.hasGeneratedList ? 'List generated' : 'List not generated'}
                                </Typography>
                                </Box>

                                {/* Event Details */}
                                <ListDetailsField label="Title" value={selectedEvent.title} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Date" value={selectedEvent.date} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Owner" value={selectedEvent.owner} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Type of Cancer" value={selectedEvent.typeOfCancer} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Description" value={selectedEvent.description} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Region" value={selectedEvent.region} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Particular Topic" value={selectedEvent.particularTopic} />
                                <Divider sx={{ mb: 1 }} />

                            </Box>
                        ) : (
                            <Typography color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>Select a event to view details</Typography>
                        )}
                    </Paper>
                    <Box sx={boxStyle}>
                        {isEditing ? (
                            <>
                                <Button variant="contained" onClick={handleSave} sx={buttonStyle}>Save</Button>
                                <Button variant="contained" onClick={handleCancel} sx={buttonStyle}>Cancel</Button>
                            </>
                        ) : selectedEvent && (
                            <>
                                <Button variant="contained" onClick={handleEdit} sx={buttonStyle}>Edit</Button>
                                <Button variant="contained" onClick={handleList} sx={buttonStyle}>
                                    { selectedEvent.hasGeneratedList ? 'View List' : 'Generate List' }
                                    </Button>
                            </>
                        )}
                    </Box>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default Event;