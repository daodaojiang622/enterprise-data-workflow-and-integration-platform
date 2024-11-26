import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import SQLiteContainer from './sqlite.js';
const app = express();
const port = 3500;
const SQLContainer = new SQLiteContainer('production');
const taskContainer = SQLContainer;
const eventContainer = SQLContainer;
app.use(bodyParser.json());
app.use(cors({ origin: '*' })); // make it globally available
// Get all tasks
app.get('/tasks', (req, res) => {
    const [code, tasks] = taskContainer.getAllTasks();
    res.status(code).json(tasks);
});
// Get all tasks, including their id, name, and isCompleted status
app.get('/tasks/names-status', (req, res) => {
    try {
        const [code, tasks] = taskContainer.getAllTasksNamesAndStatus();
        res.status(code).json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).send(`An error occurred: ${error.message}`);
    }
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
// Get all events
app.get('/events', (req, res) => {
    const [code, events] = eventContainer.getAllEvents();
    res.status(code).json(events);
});
// Get All Events with Names and IDs
app.get('/events/names-ids', (req, res) => {
    try {
        const [code, events] = eventContainer.getAllEventsNamesAndIds();
        res.status(code).json(events);
    }
    catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});
// Get All Events with IDs, Titles and hasGeneratedList Status
app.get('/events/titles-status', (req, res) => {
    try {
        const [code, events] = eventContainer.getAllEventSummaries();
        res.status(code).json(events);
    }
    catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});
// Get all donors for an event
app.get('/events/:eventId/list', (req, res) => {
    const eventId = req.params.eventId;
    const donors = eventContainer.getDonorsForEvent(eventId);
    res.status(200).json(donors);
});
// Get an event by ID
app.get('/events/:id', (req, res) => {
    const { id } = req.params;
    const [code, event] = eventContainer.getEvent(id);
    res.status(code).json(event);
});
// Create a new event
app.post('/events', (req, res) => {
    const { id, title, date, owner, typeOfCancer, description, region, particularTopic, hasGeneratedList, listId } = req.body;
    const event = { id, title, date, owner, typeOfCancer, description, region, particularTopic, hasGeneratedList, listId };
    const [code, message] = eventContainer.addEvent(event);
    res.status(code).send(message);
});
// Update an event by ID
app.put('/events/:id', (req, res) => {
    const { id } = req.params;
    const event = req.body;
    const [code, message] = eventContainer.editEvent(id, event);
    res.status(code).send(message);
});
// Delete an event by ID
app.delete('/events/:id', (req, res) => {
    const { id } = req.params;
    const [code, message] = eventContainer.deleteEvent(id);
    res.status(code).send(message);
});
// Create a new list of donors
app.post('/lists', (req, res) => {
    const donorData = req.body.donorData;
    const listId = req.body.listId;
    donorData.data.forEach((donor) => {
        eventContainer.handleDonorListData(donor, listId); // Add each donor and link to list
    });
    res.status(201).json({
        message: "List added successfully"
    });
});
// Get all lists
app.get('/lists', (req, res) => {
    const [code, lists] = eventContainer.getAllLists();
    res.status(code).json(lists);
});
// Get a list by ID
app.get('/lists/:id', (req, res) => {
    const { id } = req.params;
    const [code, list] = eventContainer.getList(id);
    res.status(code).json(list);
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
