import React, { useState } from 'react';
import { Button, List, ListItem, ListItemText, Paper, Box, Typography, Grid2, Divider, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskListItem from '../Components/TaskListItem';
import TaskDetailsField from '../Components/TaskDetailsField';
import TaskForm from '../Components/TaskForm';
import { boxStyle, buttonStyle, colors } from '../Utils/Style';
import { tasks } from '../Data';

export interface Task {
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
    assigner: string,
    assignee: string,
    isCompleted: boolean,
    isApprovedByApprover1: boolean,
    isApprovedByApprover2: boolean,
    isApprovedByApprover3: boolean,
};

const Task: React.FC<TaskProps> = ({ headers, data }) => {

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
        setEditableTask({ id: '', name: '', event: '', dueDate: '', description: '', commentId: 0, comment: '', approver1: '', approver2: '', approver3: '', assignee: '', assigner: '', isCompleted: false, isApprovedByApprover1: false, isApprovedByApprover2: false, isApprovedByApprover3: false });
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeTask<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableTask(prevTask => prevTask ? { ...prevTask, [name]: value } : null);
    };

    const handleSave = () => {
        if (!editableTask) return;

            // Define required fields
        const { name, event, dueDate, description, approver1, assignee } = editableTask;

        // Check if any required field is missing
        if (!name || !event || !dueDate || !description || !approver1 || !assignee) {
            alert("Please fill in all mandatory fields: Name, Event, Due Date, Description, Approver 1, and Assign To.");
            return;
        }

        const eventDate = new Date(dueDate);
        const currentDate = new Date();
        if (eventDate < currentDate) {
            alert("You cannot create a task for the past.");
            return;
        }

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
            <Box sx={{ backgroundColor: colors.secondaryBackground, paddingTop: 1.5, paddingBottom: 0.1, mb: 2, borderRadius: 2 }}>
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
                                <TaskListItem
                                key={task.id}
                                task={task}
                                isSelected={selectedTask?.id === task.id}
                                onSelect={handleTaskSelect}
                            />
                        ))}
                    </List>
                </Paper>
                <Button
                    variant="contained"
                    onClick={handleCreate}
                    fullWidth
                    sx={{ mt: 5, backgroundColor: colors.primary, ':focus': {outline: 'none'}}}
                    >
                    Create
                </Button>
            </Grid2>
        
            {/* Right Panel - Task Details */}
            <Grid2 item xs={4} >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">
                    {isEditing ? (selectedTask ? "Edit Task" : "Create Task") : "Task Details"}
                </Typography>
                
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
                    <TaskForm
                        editableTask={editableTask}
                        handleInputChange={handleInputChange}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                    />
                ) : ( selectedTask ? (
                    <Box>
                        {/* Task Status Bar */}
                        <TaskStatusBar selectedTask={selectedTask} />

                        {/* Task Details */}
                        <TaskDetailsField label="Name:" value={selectedTask.name} />
                        <Divider sx={{ mb: 1 }} />
                        
                        <TaskDetailsField label="Event:" value={selectedTask.event} />
                        <Divider sx={{ mb: 1 }} />

                        <TaskDetailsField label="Due Date:" value={selectedTask.dueDate} />         
                        <Divider sx={{ mb: 1 }} />

                        <TaskDetailsField label="Description:" value={selectedTask.description} />
                        <Divider sx={{ mb: 1 }} />
                        
                        <TaskDetailsField label="Comment:" value={selectedTask.comment} />
                        <Divider sx={{ mb: 1 }} />

                        <TaskDetailsField label="Approver 1:" value={selectedTask.approver1} />
                        <Divider sx={{ mb: 1 }} />
                        <TaskDetailsField label="Approver 2:" value={selectedTask.approver2} />
                        <Divider sx={{ mb: 1 }} />
                        <TaskDetailsField label="Approver 3:" value={selectedTask.approver3} />
                    </Box>
                ) : (
                    <Typography color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                        Select an task to view details
                    </Typography>
                    )
                )}
                </Paper>
                    {selectedTask ? (
                        <Box sx={boxStyle}>
                            <Button
                                variant="contained"
                                onClick={isEditing ? handleSave : handleEdit}
                                sx={buttonStyle}
                            >
                                {isEditing ? 'Save' : 'Edit'}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={isEditing ? handleCancel : handleGenerateList}
                                sx={buttonStyle}
                            >
                                {isEditing ? 'Cancel' : 'Completed'}
                            </Button>
                        </Box>
                    ) : isEditing ? (
                        <Box sx={boxStyle}>
                            <Button variant="contained" onClick={handleSave} sx={buttonStyle}>
                                Save
                            </Button>
                            <Button variant="contained" onClick={handleCancel} sx={buttonStyle}>
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