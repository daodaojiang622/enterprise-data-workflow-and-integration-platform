import React, {useState, useEffect, useMemo} from 'react';
import { Box, Button, Divider, Grid, List, Paper, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStore, IEvent } from '../store';
import { colors } from '../Utils/Style';
import ListDetailsField from "../Components/ListDetailsField";

const Event: React.FC = () => {
    const { events, reloadEvents, createEvent, updateEvent, deleteEvent } = useStore();
    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
    const [editableEvent, setEditableEvent] = useState<Partial<IEvent> | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        reloadEvents();
    }, []);

    const handleSelectEvent = (event: IEvent) => {
        setSelectedEvent(event);
        setIsEditing(false);
    };

    const handleCreate = () => {
        setEditableEvent({
            title: '',
            date: '',
            owner: '',
            typeOfCancer: '',
            description: '',
            region: '',
            particularTopic: '',
        });
        setIsEditing(true);
    };

    const handleEdit = () => {
        if (selectedEvent) {
            setEditableEvent({ ...selectedEvent });
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        if (!editableEvent) return;
        if (editableEvent.id) {
            await updateEvent(editableEvent as IEvent);
            setSelectedEvent({
                ...selectedEvent!,
                ...editableEvent,
            })
        } else {
            await createEvent(editableEvent as Omit<IEvent, 'id' | 'hasGeneratedList' | 'listId'>);
        }
        reloadEvents();
        setIsEditing(false);
        setEditableEvent(null);
    };

    const handleDelete = async () => {
        if (selectedEvent) {
            await deleteEvent(selectedEvent.id);
            reloadEvents();
            setSelectedEvent(null);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableEvent((prev) => ({ ...prev, [name]: value }));
    };


    return (
        <Box width={'70vw'} margin={'auto'}>
            <Grid container spacing={2}>
                {/* Left Panel: Events List */}
                <Grid item xs={2}>
                    <Typography variant="h4" gutterBottom>Events</Typography>
                    <Paper sx={{ height: '435px', overflow: 'auto', width: '100%' }}>
                        <List>
                            {events.map((event) => (
                                <Box
                                    key={event.id}
                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',
                                        backgroundColor: selectedEvent?.id === event.id ? colors.primary : 'transparent',
                                    }}
                                    onClick={() => handleSelectEvent(event)}
                                >
                                    <Typography>{event.title}</Typography>
                                </Box>
                            ))}
                        </List>
                    </Paper>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 5, backgroundColor: colors.primary }}
                        onClick={handleCreate}
                    >
                        Create
                    </Button>
                </Grid>

                {/* Right Panel: Event Details or Form */}
                <Grid item xs={10}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h4">
                            {isEditing ? (editableEvent?.id ? 'Edit Event' : 'Create Event') : 'Event Details'}
                        </Typography>
                        {selectedEvent && !isEditing && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDelete}
                                sx={{ ml: 2 }}
                            >
                                <DeleteIcon />
                            </Button>
                        )}
                    </Box>
                    <Paper sx={{ p: 2, height: '400px', overflow: 'auto' }}>
                        {isEditing ? (
                            <Box>
                                <TextField
                                    label="Event Name:*"
                                    name="title"
                                    value={editableEvent?.title || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Date: DD/MM/YYYY *"
                                    name="date"
                                    value={editableEvent?.date || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Owner*"
                                    name="owner"
                                    value={editableEvent?.owner || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Type of Cancer*"
                                    name="typeOfCancer"
                                    value={editableEvent?.typeOfCancer || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Description*"
                                    name="description"
                                    value={editableEvent?.description || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Region*"
                                    name="region"
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
                            </Box>
                        ) : selectedEvent ? (
                            <Box>
                                <Box sx={{ backgroundColor: colors.secondaryBackground, padding: 1, mb: 1, borderRadius: 2 }}>
                                    <Typography
                                        sx={{
                                            color: selectedEvent.hasGeneratedList ? 'green' : 'red',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {selectedEvent.hasGeneratedList ? 'List generated' : 'List not generated'}
                                    </Typography>
                                </Box>
                                <ListDetailsField label="Title" value={selectedEvent.title} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Date" value={selectedEvent.date} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Owner" value={selectedEvent.owner} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Type of Cancer" value={selectedEvent.typeOfCancer || ''} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Description" value={selectedEvent.description || ''} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Region" value={selectedEvent.region || ''} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Particular Topic" value={selectedEvent.particularTopic || ''} />
                            </Box>
                        ) : (
                            <Typography color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                                Select an event to view details
                            </Typography>
                        )}
                    </Paper>
                    <Box sx={{ mt: 2 }}>
                        {isEditing ? (
                            <>
                                <Button variant="contained" onClick={handleSave} sx={{ mr: 2 }}>Save</Button>
                                <Button variant="contained" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </>
                        ) : selectedEvent && (
                            <>
                                <Button variant="contained" onClick={handleEdit} sx={{ mr: 2 }}>Edit</Button>
                                <Button variant="contained">
                                    {selectedEvent.hasGeneratedList ? 'View List' : 'Generate List'}
                                </Button>
                            </>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Event;
