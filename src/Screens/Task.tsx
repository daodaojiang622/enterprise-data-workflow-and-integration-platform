import React, { useState } from 'react';
import { Button, List, ListItem, ListItemText, Paper, Box, Typography, Grid2, Divider, TextField } from '@mui/material';

interface Task {
    id: string,
    taskName: string,
    approver1: string,
    approver2: string,
    approver3: string,
    taskDescription: string,
    recommendation: string,
    decisionMaker: string,
    commentId: number,
    comment: string,
    user: string,
    dueDate: string,
    Task: string,
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
            recommendation: 'We recommend this',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: 'we cant do this',
            user: 'MeowMeow',
            dueDate: '12/12/2024',
            Task: 'Task A'
        },
        {
            id: '2',
            taskName: 'Task2',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: '',
            taskDescription: 'We need to do this task',
            recommendation: 'We recommend this',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: '',
            user: 'MeowMeow',
            dueDate: '01/01/2025',
            Task: 'Task B'
        },
        {
            id: '3',
            taskName: 'Task3',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            taskDescription: 'We need to do this task',
            recommendation: 'We recommend this',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: 'Yes we can',
            user: 'MeowMeow',
            dueDate: '01/12/2024',
            Task: 'Task C'
        },
        {
            id: '4',
            taskName: 'Task4',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            taskDescription: 'We need to do this task',
            recommendation: 'We recommend this',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: 'Yes we can',
            user: 'MeowMeow',
            dueDate: '01/12/2025',
            Task: 'Task A'
        },
        {
            id: '5',
            taskName: 'Task5',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            taskDescription: 'We need to do this task',
            recommendation: 'We recommend this',
            decisionMaker: 'Apple',
            commentId: 111,
            comment: 'Yes we can',
            user: 'MeowMeow',
            dueDate: '01/12/2025',
            Task: 'Task A'
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
            <Grid2 item xs={4}>
                <Typography variant="h4" gutterBottom>
                    Tasks
                </Typography>
                    
                <Paper sx={{p: 5, height: "100%" }}>
                    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
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
                            <ListItemText primary={task.taskName} />
                        </ListItem>
                    ))}
                    </List>
                </Paper>
                <Button
                    variant="contained"
                    onClick={handleCreate}
                    fullWidth
                    sx={{ mt: 2 }}
                    >
                    Create
                </Button>
            </Grid2>
        
            {/* Right Panel - Task Details */}
            <Grid2 item xs={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Task Details</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    {selectedTask && !isEditing && (
                        <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        >
                        Delete
                        </Button>
                    )}
                    </Box>
            </Box>
                <Paper sx={{ p: 2, width: "300%", height:"200%"}}>
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
                    <Grid2 container spacing={2}>
                    <Grid2 item xs={6}>
                        <Typography variant="subtitle2">Name</Typography>
                        <Typography>{selectedTask.name}</Typography>
                        <Divider sx={{ my: 1 }} />
                        
                        <Typography variant="subtitle2">Date</Typography>
                        <Typography>{selectedTask.date}</Typography>
                        <Divider sx={{ my: 1 }} />
                        
                        <Typography variant="subtitle2">Type of Cancer</Typography>
                        <Typography>{selectedTask.typeOfCancer}</Typography>
                        <Divider sx={{ my: 1 }} />
                        
                        <Typography variant="subtitle2">Description</Typography>
                        <Typography>{selectedTask.description}</Typography>
                    </Grid2>
                    
                    <Grid2 item xs={6}>
                        <Typography variant="subtitle2">ID</Typography>
                        <Typography>{selectedTask.id}</Typography>
                        <Divider sx={{ my: 1 }} />
                        
                        <Typography variant="subtitle2">Region</Typography>
                        <Typography>{selectedTask.region}</Typography>
                        <Divider sx={{ my: 1 }} />
                        
                        <Typography variant="subtitle2">Particular Topic</Typography>
                        <Typography>{selectedTask.particularTopic}</Typography>
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
                        Select an task to view details
                    </Typography>
                    )
                )}
                </Paper>
            </Grid2>    
        
        </Grid2>    
    </Box>
    );
};

// Export the TaskTable component as the default export of this module
export default Task;