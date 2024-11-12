import React, { useState } from 'react';
import { Button, List, ListItem, ListItemText, Paper, Box, Typography, Grid2, Divider, TextField } from '@mui/material';

interface Task {
    id: string,
    taskName: string,
    approver1: string,
    approver2: string,
    approver3: string,
    taskDescription: string,
    decisionMaker: string,
    commentId: number,
    comment: string,
    user: string,
    dueDate: string,
    Event: string,
};

const Task: React.FC<TaskProps> = ({ headers, data }) => {
    const tasks: Task[] = [
        {
            id: '1',
            taskName: 'Task1',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            taskDescription: 'We need to do this task',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: 'we cant do this',
            user: 'MeowMeow',
            dueDate: '12/12/2024',
            Event: 'Event A'
        },
        {
            id: '2',
            taskName: 'Task2',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: '',
            taskDescription: 'We need to do this task',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: '',
            user: 'MeowMeow',
            dueDate: '01/01/2025',
            Event: 'Event B'
        },
        {
            id: '3',
            taskName: 'Task3',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            taskDescription: 'We need to do this task',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: 'Yes we can',
            user: 'MeowMeow',
            dueDate: '01/12/2024',
            Event: 'Event C'
        },
        {
            id: '4',
            taskName: 'Task4',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            taskDescription: 'We need to do this task',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: 'Yes we can',
            user: 'MeowMeow',
            dueDate: '01/12/2025',
            Event: 'Event A'
        },
        {
            id: '5',
            taskName: 'Task5',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            taskDescription: 'We need to do this task',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: 'Yes we can',
            user: 'MeowMeow',
            dueDate: '01/12/2025',
            Event: 'Event A'
        }
    ];

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableTask, setEditableTask] = useState<Task | null>(null);

    const handleTaskSelect = (task: Task) => {
        setSelectedTask(task);
        setIsEditing(false);
    };

    const handleDelete = () => {
    if (selectedTask) {
        setTasks(tasks.filter(task => task.id !== selectedTask.id));
        setSelectedTask(null);
    }
    };

    const handleEdit = () => {
    // Implement edit functionality
    if (selectedTask) {
        setEditableTask(selectedTask);
        setIsEditing(true);
        console.log('Edit task:', selectedTask);
    } else {
        console.log('No task selected for editing');
    }
    };

    const handleCreate = () => {
        // Implement create functionality
        setEditableTask({id: '', name: '', date: '', typeOfCancer: '', description: '', region: '', particularTopic: ''});
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeTask<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableTask(prevTask => prevTask ? { ...prevTask, [name]: value } : null);
    };

    const handleSave = () => {
        if (editableTask) {
            if (editableTask.id) {
                // Edit task
                const updatedTasks = tasks.map(task => task.id === editableTask.id ? editableTask : task);
                setTasks(updatedTasks);
            } else {
                // Create new task
                setTasks([...tasks, { ...editableTask, id: Date.now().toString() }]);
            }
            setSelectedTask(editableTask);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditableTask(null);
    };

    const handleGenerateList = () => {
    // Implement list generation functionality
    console.log('Generate list for task:', selectedTask);
    if (selectedTask) {
        const taskList = tasks.filter(task => task.id === selectedTask.id);
        console.log('Generated list:', taskList);
    } else {
        console.log('No task selected for list generation');
    }
    };
    
    return (
        <Box p={2}>
          <Grid2 container spacing={2}>

            {/* Left Panel - Tasks List */}
            <Grid2 item xs={4} ml={5} mr={10} >
                <Typography variant="h4" gutterBottom>
                    Tasks
                </Typography>
                    
                <Paper sx={{p: 5, height: '358px', overflow: 'auto' }}>
                    <List >
                    {tasks.map((task) => (
                        <ListItem
                            key={task.id}
                            button
                            selected={selectedTask?.id === task.id}
                            onClick={() => handleTaskSelect(task)}
                            sx={{ 
                                '&.Mui-selected': {
                                backgroundColor: '#e3f2fd'
                                }
                            }}
                        >
                        <ListItemText 
                            primary={task.taskName} 
                            sx={{ 
                                color: selectedTask?.id === task.id ? 'purple' : 'inherit' 
                            }} />
                        </ListItem>
                    ))}
                    </List>
                </Paper>
                <Button
                    variant="contained"
                    onClick={handleCreate}
                    fullWidth
                    sx={{ mt: 5, backgroundColor: '#36a0c8' }}
                    >
                    Create
                </Button>
            </Grid2>
        
            {/* Right Panel - Task Details */}
            <Grid2 item xs={4} >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Task Details</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {selectedTask && !isEditing && (
                    <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    sx={{ ml: 60}}
                    >
                        Delete
                    </Button>
                    )}
                </Box>
            </Box>
                <Paper sx={{ p: 2,  height: '400px', overflow: 'auto'}}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    </Box>
                
                {isEditing ? (
                    <Box>
                        <Grid2 container spacing={2}>
                        <Grid2 item xs={6}>
                            <TextField
                                label="Name"
                                name="name"
                                value={editableTask?.name || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Date"
                                name="date"
                                value={editableTask?.date || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Type of Cancer"
                                name="typeOfCancer"
                                value={editableTask?.typeOfCancer || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={editableTask?.description || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid2>

                        <Grid2 item xs={6}>
                            <TextField
                                label="Region"
                                name="Region"
                                value={editableTask?.region || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Particular Topic"
                                name="particularTopic"
                                value={editableTask?.particularTopic || ''}
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
                ) : ( selectedTask ? (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Name: </Typography>
                        <Typography>{selectedTask.taskName}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Event: </Typography>
                        <Typography>{selectedTask.Event}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Due Date: </Typography>
                        <Typography>{selectedTask.dueDate}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Task Description: </Typography>
                        <Typography>{selectedTask.taskDescription}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Comment: </Typography>
                        <Typography>{selectedTask.commentId} commented: {selectedTask.comment}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Approver 1: </Typography>
                        <Typography>{selectedTask.approver1}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Approver 2: </Typography>
                        <Typography>{selectedTask.approver2}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Approver 3: </Typography>
                        <Typography>{selectedTask.approver3}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Decision Maker: </Typography>
                        <Typography>{selectedTask.decisionMaker}</Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                        Select an task to view details
                    </Typography>
                    )
                )}
                </Paper>
                {selectedTask ? (
                    <Box sx={{ mt: 5, display: 'flex', gap: 10, justifyContent: 'flex-start' }}>
                        <Button variant="contained" onClick={handleEdit} sx={{backgroundColor: '#36a0c8'}}>
                            Edit
                        </Button>
                        <Button variant="contained" onClick={handleGenerateList} sx={{backgroundColor: '#36a0c8'}}>
                            View / Generate List
                        </Button>
                        <Button variant="contained" onClick={handleGenerateList} sx={{backgroundColor: '#36a0c8'}}>
                            Completed
                        </Button>
                    </Box>
                ) : null}
            </Grid2>    
        
        </Grid2>    
    </Box>
    );
};

// Export the TaskTable component as the default export of this module
export default Task;