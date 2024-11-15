import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import SQLiteContainer from './sqlite.js';
const app = express();
const port = 3500;
const SQLContainer = new SQLiteContainer('production');
const taskContainer = SQLContainer;
app.use(bodyParser.json());
app.use(cors({ origin: '*' })); // make it globally available
// Get all tasks
app.get('/tasks', (req, res) => {
    const [code, tasks] = taskContainer.getAllTasks();
    res.status(code).json(tasks);
});
// Get a task by ID
app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const [code, task] = taskContainer.getTask(id);
    res.status(code).json(task);
});
// Create a new task
app.post('/tasks', (req, res) => {
    const { id, name, event, dueDate, description, comment, approver1, approver2, approver3, assigner, assignee, isCompleted, isApprovedByApprover1, isApprovedByApprover2, isApprovedByApprover3 } = req.body;
    const task = { id, name, event, dueDate, description, comment, approver1, approver2, approver3, assigner, assignee, isCompleted, isApprovedByApprover1, isApprovedByApprover2, isApprovedByApprover3 };
    const [code, message] = taskContainer.addTask(task);
    res.status(code).send(message);
});
// Update a task by ID
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const task = req.body;
    const [code, message] = taskContainer.editTask(id, task);
    res.status(code).send(message);
});
// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const [code, message] = taskContainer.deleteTask(id);
    res.status(code).send(message);
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
