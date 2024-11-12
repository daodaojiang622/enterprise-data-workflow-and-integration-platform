import React, { useState, useEffect } from 'react';
import { Button, List, Paper, Box, Typography, Divider, Grid2 } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskListItem from '../Components/TaskListItem';
import TaskDetailsField from '../Components/ListDetailsField';
import TaskForm from '../Components/TaskForm';
import { boxStyle, buttonStyle, colors } from '../Utils/Style';
import { tasks as initialTasks } from '../Data';
import ListDetailsField from '../Components/ListDetailsField';

export interface Task {
    id: string;
    name: string;
    event: string;
    dueDate: string;
    description: string;
    commentId: number;
    comment: string;
    approver1: string;
    approver2: string;
    approver3: string;
    assigner: string;
    assignee: string;
    isCompleted: boolean;
    isApprovedByApprover1: boolean;
    isApprovedByApprover2: boolean;
    isApprovedByApprover3: boolean;
}

interface TaskProps {
    selectedTaskId: string | null;
}

const Task: React.FC<TaskProps> = ({ selectedTaskId }) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableTask, setEditableTask] = useState<Task | null>(null);

    useEffect(() => {
        if (selectedTaskId) {
            const task = tasks.find((task) => task.id === selectedTaskId);
            setSelectedTask(task || null);
        }
    }, [selectedTaskId, tasks]);

    const handleTaskSelect = (task: Task) => {
        console.log('Task selected:', task);
        setSelectedTask(task);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (selectedTask) {
            setTasks(tasks.filter((task) => task.id !== selectedTask.id));
            setSelectedTask(null);
        }
    };

    const handleEdit = () => {
        if (selectedTask) {
            setEditableTask(selectedTask);
            setIsEditing(true);
        }
    };

    const handleCreate = () => {
        setSelectedTask(null);
        setEditableTask({
            id: '10',
            name: 'aaa',
            event: 'Event B',
            dueDate: '11/11/2026',
            description: 'hhhh',
            commentId: 0,
            comment: '',
            approver1: 'test',
            approver2: '',
            approver3: '',
            assignee: 'test',
            assigner: '',
            isCompleted: false,
            isApprovedByApprover1: false,
            isApprovedByApprover2: false,
            isApprovedByApprover3: false,
        });
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableTask((prevTask) => (prevTask ? { ...prevTask, [name]: value } : null));
    };

    const handleSave = () => {
        if (!editableTask) return;

        const { name, event, dueDate, description, approver1, assignee } = editableTask;
        if (!name || !event || !dueDate || !description || !approver1 || !assignee) {
            alert('Please fill in all mandatory fields: Name, Event, Due Date, Description, Approver 1, and Assignee.');
            return;
        }

        const eventDate = new Date(dueDate);
        if (eventDate < new Date()) {
            alert('You cannot create or edit a task for a past date.');
            return;
        }

        if (editableTask.id) {
            const updatedTasks = tasks.map((task) =>
                task.id === editableTask.id ? editableTask : task
            );
            setTasks(updatedTasks);
        } else {
            setTasks([...tasks, { ...editableTask, id: Date.now().toString() }]);
        }
        setSelectedTask(editableTask);
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
            setIsEditing(false);
            setEditableTask(null);
        }
    };

    const handleGenerateList = () => {
        if (selectedTask) {
            console.log('Generate list for task:', selectedTask);
        } else {
            console.log('No task selected for list generation');
        }
    };

    const getApprovalMessage = (task: Task) => {
        const approvers = [
            task.isApprovedByApprover1 && task.approver1,
            task.isApprovedByApprover2 && task.approver2,
            task.isApprovedByApprover3 && task.approver3,
        ].filter(Boolean);

        const pendingApprovers = [
            !task.isApprovedByApprover1 && task.approver1,
            !task.isApprovedByApprover2 && task.approver2,
            !task.isApprovedByApprover3 && task.approver3,
        ].filter(Boolean);

        if (task.isCompleted) {
            return 'Task Completed';
        } else if (approvers.length > 0) {
            const waitingMessage = pendingApprovers.length > 0 ? ` Waiting for approval from ${pendingApprovers.join(', ')}.` : '';
            return `Approved by ${approvers.join(', ')}.${waitingMessage}`;
        } else if (pendingApprovers.length > 0) {
            return `Waiting for approval from ${pendingApprovers.join(', ')}.`;
        }
        return null;
    };

    return (
        <Box p={2}>
            <Grid2 container spacing={2}>
                {/* Left Panel - Tasks List */}
                <Grid2 item xs={4} ml={5} mr={5}>
                    <Typography variant="h4" gutterBottom>Tasks</Typography>
                    <Paper sx={{ height: '435px', overflow: 'auto', width: '200px' }}>
                        <List>
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
                    <Button variant="contained" onClick={handleCreate} fullWidth sx={{ mt: 5, backgroundColor: colors.primary, ':focus': { outline: 'none' } }}>
                        Create
                    </Button>
                </Grid2>

                {/* Right Panel - Task Details */}
                <Grid2 item xs={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h4">
                            {isEditing ? (selectedTask ? 'Edit Task' : 'Create Task') : 'Task Details'}
                        </Typography>
                        {selectedTask && !isEditing && (
                            <Button variant="contained" color="error" onClick={handleDelete} sx={{ ml: 2 }}>
                                <DeleteIcon />
                            </Button>
                        )}
                    </Box>
                    <Paper sx={{ p: 2, height: '400px', overflow: 'auto', width: '800px' }}>
                        {isEditing ? (
                            <TaskForm
                                editableTask={editableTask}
                                handleInputChange={handleInputChange}
                                handleSave={handleSave}
                                handleCancel={handleCancel}
                            />
                        ) : selectedTask ? (
                            <Box>
                                {/* Status Bar */}
                                <Box sx={{ backgroundColor: colors.secondaryBackground, padding: 1, mb: 2, borderRadius: 2 }}>
                                    <Typography sx={{ color: 'green', fontWeight: 'bold', mb: 1 }}>{getApprovalMessage(selectedTask)}</Typography>
                                </Box>

                                {/* Task Details */}
                                <ListDetailsField label="Name" value={selectedTask.name} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Event" value={selectedTask.event} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Due Date" value={selectedTask.dueDate} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Description" value={selectedTask.description} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Comment" value={selectedTask.comment} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Approver 1" value={selectedTask.approver1} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Approver 2" value={selectedTask.approver2} />
                                <Divider sx={{ mb: 1 }} />
                                <ListDetailsField label="Approver 3" value={selectedTask.approver3} />
                            </Box>
                        ) : (
                            <Typography color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>Select a task to view details</Typography>
                        )}
                    </Paper>
                    <Box sx={boxStyle}>
                        {isEditing ? (
                            <>
                                <Button variant="contained" onClick={handleSave} sx={buttonStyle}>Save</Button>
                                <Button variant="contained" onClick={handleCancel} sx={buttonStyle}>Cancel</Button>
                            </>
                        ) : selectedTask && (
                            <>
                                <Button variant="contained" onClick={handleEdit} sx={buttonStyle}>Edit</Button>
                                <Button variant="contained" onClick={handleGenerateList} sx={buttonStyle}>Completed</Button>
                            </>
                        )}
                    </Box>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default Task;
