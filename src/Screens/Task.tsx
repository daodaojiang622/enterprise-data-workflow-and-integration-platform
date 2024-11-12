import React, { useState } from 'react';
import { Button, List, ListItem, ListItemText, Paper, Box, Typography, Grid2, Divider, TextField } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DeleteIcon from '@mui/icons-material/Delete';

interface Task {
    id: string,
    name: string,
    event: string,
    dueDate: string,
    description: string,
    commentId: number,
    comment: string,
    approver1: string,
    approver2: string,
    approver3: string,
    owner: string,
    isCompleted: boolean,
    isApprovedByApprover1: boolean,
    isApprovedByApprover2: boolean,
    isApprovedByApprover3: boolean,
};

const Task: React.FC<TaskProps> = ({ headers, data }) => {
    const tasks: Task[] = [
        {
            id: '1',
            name: 'Draft a proposal on the new project',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            description: 'We need to do this task We need to do this task We need to do this task We need to do this task We need to do this task We need to do this task',
            commentId: 111,
            comment: 'we cant do this',
            owner: 'MeowMeow',
            dueDate: '12/12/2024',
            event: 'Event A',
            isCompleted: true,
            isApprovedByApprover1: true,
            isApprovedByApprover2: true,
            isApprovedByApprover3: false,
        },
        {
            id: '2',
            name: 'Task2',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: '',
            description: 'We need to do this task',
            commentId: 111,
            comment: '',
            owner: 'MeowMeow',
            dueDate: '01/01/2025',
            event: 'Event B',
            isCompleted: false,
            isApprovedByApprover1: false,
            isApprovedByApprover2: false,
            isApprovedByApprover3: false,
        },
        {
            id: '3',
            name: 'Task3',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            description: 'We need to do this task',
            commentId: 111,
            comment: 'Yes we can',
            owner: 'MeowMeow',
            dueDate: '01/12/2024',
            event: 'Event C',
            isCompleted: true,
            isApprovedByApprover1: true,
            isApprovedByApprover2: true,
            isApprovedByApprover3: true,
        },
        {
            id: '4',
            name: 'Task4',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            description: 'We need to do this task',
            commentId: 111,
            comment: 'Yes we can',
            owner: 'MeowMeow',
            dueDate: '01/12/2025',
            event: 'Event A',
            isCompleted: false,
            isApprovedByApprover1: false,
            isApprovedByApprover2: false,
            isApprovedByApprover3: false,
        },
        {
            id: '5',
            name: 'Task5',
            approver1: 'Apple',
            approver2: 'Banana',
            approver3: 'Tree',
            description: 'We need to do this task',
            commentId: 111,
            comment: 'Yes we can',
            owner: 'MeowMeow',
            dueDate: '01/12/2025',
            event: 'Event A',
            isCompleted: false,
            isApprovedByApprover1: false,
            isApprovedByApprover2: false,
            isApprovedByApprover3: false,
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
        setSelectedTask(null);
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
        const confirm = window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.");
        if (confirm) {
            setIsEditing(false);
            setEditableTask(null);
        }
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
    
    function getApprovalMessage(selectedTask: Task) {
        const approvers = [
            selectedTask.isApprovedByApprover1 && selectedTask.approver1,
            selectedTask.isApprovedByApprover2 && selectedTask.approver2,
            selectedTask.isApprovedByApprover3 && selectedTask.approver3,
        ].filter(Boolean);

        const pendingApprovers = [
            !selectedTask.isApprovedByApprover1 && selectedTask.approver1,
            !selectedTask.isApprovedByApprover2 && selectedTask.approver2,
            !selectedTask.isApprovedByApprover3 && selectedTask.approver3,
        ].filter(Boolean);    
    
        if (selectedTask.isCompleted) {
            return approvers.length > 0 
                ? `Task Completed. Approved by ${approvers.join(', ')}.`
                : "Task Completed";
        } else if (approvers.length > 0) {
            const waitingMessage = pendingApprovers.length > 0 
                ? ` Waiting for approval from ${pendingApprovers.join(', ')}.`
                : '';
            return `Approved by Approver ${approvers.join(', ')}.${waitingMessage}`;
        } else if (pendingApprovers.length > 0) {
            return `Waiting for approval from ${pendingApprovers.join(', ')}.`;
        }

        return null;
    }
    
    function TaskStatusBar({ selectedTask }: { selectedTask: Task }) {
        const message = getApprovalMessage(selectedTask);
    
        if (!message) return null;
    
        return (
            <Box sx={{ backgroundColor: '#dae4e8', paddingTop: 1.5, paddingBottom: 0.1, mb: 2, borderRadius: 2 }}>
                <Typography sx={{ color: 'green', fontWeight: 'bold', mb: 2, align: 'center' }}>
                    {message}
                </Typography>
            </Box>
        );
    }

    return (
        <Box p={2}>
          <Grid2 container spacing={2}>

            {/* Left Panel - Tasks List */}
            <Grid2 item xs={4} ml={5} mr={5} >
                <Typography variant="h4" gutterBottom>
                    Tasks
                </Typography>
                    
                <Paper sx={{height: '435px', overflow: 'auto', width: '200px'}}>
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
                                },
                                textAlign: 'center',
                                ':focus': {outline: 'none'}
                            }}
                        >
                        <ListItemText 
                            primary={task.name} 
                            sx={{ 
                                color: selectedTask?.id === task.id ? 'purple' : 'inherit' ,
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word'
                            }} />
                            
                            <TaskAltIcon
                            sx={{
                                color: task.isCompleted ? 'green' : 'darkgray',
                                marginLeft: 1,
                                fontSize: 18
                            }}
                        />
                        </ListItem>
                        
                    ))}
                    </List>
                </Paper>
                <Button
                    variant="contained"
                    onClick={handleCreate}
                    fullWidth
                    sx={{ mt: 5, backgroundColor: '#36a0c8', ':focus': {outline: 'none'}}}
                    >
                    Create
                </Button>
            </Grid2>
        
            {/* Right Panel - Task Details */}
            <Grid2 item xs={4} >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                {isEditing? ( <Typography variant="h4">Create Task</Typography>
                ) : (
                    <Typography variant="h4">Task Details</Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {selectedTask && !isEditing && (
                    <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    sx={{ ml: 60, ':focus': {outline: 'none'}}}
                    >
                    <DeleteIcon />
                    </Button>
                    )}
                </Box>
            </Box>
                <Paper sx={{ p: 2,  height: '400px', overflow: 'auto', width: '800px'}}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                    </Box>
                
                {isEditing ? (
                    <Box>
                        <Grid2 >
                            <TextField
                                label="Name"
                                name="name"
                                value={editableTask?.name || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Event"
                                name="Event"
                                value={editableTask?.dueDate || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Due Date"
                                name="dueDate"
                                value={editableTask?.dueDate || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={editableTask?.description|| ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Comment"
                                name="comment"
                                value={editableTask?.comment || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Approver 1"
                                name="approver1"
                                value={editableTask?.approver1 || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Approver 2"
                                name="approver2"
                                value={editableTask?.approver2 || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Approver 3"
                                name="approver3"
                                value={editableTask?.approver3 || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Assign to"
                                name="owner"
                                value={editableTask?.owner || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid2>
                    </Box>
                ) : ( selectedTask ? (
                    <Box>
                        {/* Task Status Bar */}
                        <TaskStatusBar selectedTask={selectedTask} />

                        {/* Task Details */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold', wordWrap: 'break-word', overflowWrap: 'break-word'}}>Name: </Typography>
                        <Typography>{selectedTask.name}</Typography>
                        </Box>

                        <Divider sx={{ mb: 1 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Event: </Typography>
                        <Typography>{selectedTask.event}</Typography>
                        </Box>
                        
                        <Divider sx={{ mb: 1 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Due Date: </Typography>
                        <Typography>{selectedTask.dueDate}</Typography>
                        </Box>
                        
                        <Divider sx={{ mb: 1 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold', wordWrap: 'break-word', overflowWrap: 'break-word'}}>Task Description: </Typography>
                        <Typography>{selectedTask.description}</Typography>
                        </Box>

                        <Divider sx={{ mb: 1 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Comment: </Typography>
                        <Typography>{selectedTask.commentId} commented: {selectedTask.comment}</Typography>
                        </Box>

                        <Divider sx={{ mb: 1 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Approver 1: </Typography>
                        <Typography>{selectedTask.approver1}</Typography>
                        </Box>

                        <Divider sx={{ mb: 1 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Approver 2: </Typography>
                        <Typography>{selectedTask.approver2}</Typography>
                        </Box>

                        <Divider sx={{ mb: 1 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{color: '#905aa7', fontWeight: 'bold'}}>Approver 3: </Typography>
                        <Typography>{selectedTask.approver3}</Typography>
                        </Box>

                    </Box>
                ) : (
                    <Typography color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                        Select an task to view details
                    </Typography>
                    )
                )}
                </Paper>
                {selectedTask && !isEditing ? (
                    <Box sx={{ mt: 5, display: 'flex', gap: 10, justifyContent: 'center'}}>
                        <Button variant="contained" onClick={handleEdit} sx={{backgroundColor: '#36a0c8', ':focus': {outline: 'none'}}}>
                            Edit
                        </Button>
                        <Button variant="contained" onClick={handleGenerateList} sx={{backgroundColor: '#36a0c8', ':focus': {outline: 'none'}}}>
                            Completed
                        </Button>
                    </Box>
                ) : !selectedTask && isEditing ? (
                    <Box sx={{ mt: 5, display: 'flex', gap: 10, justifyContent: 'center'}}>
                        <Button variant="contained" onClick={handleSave} sx={{backgroundColor: '#36a0c8', ':focus': {outline: 'none'}}}>
                            Save
                        </Button>
                        <Button variant="contained" onClick={handleCancel} sx={{backgroundColor: '#36a0c8', ':focus': {outline: 'none'}}}>
                            Cancel
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