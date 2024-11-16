import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
/**
 * Class representing a SQLite container for managing tasks and comments.
 */
class SQLiteContainer {
    /**
     * Constructor for SQLiteContainer.
     * @param database - The name of the database file.
     */
    constructor(database) {
        // Get the directory name of the current module
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const dataPath = path.join(__dirname, '..');
        this.dbFilename = path.join(dataPath, database + '.db');
        console.log(`Database file path: ${this.dbFilename}`);
        // Check if the database file exists
        if (!fs.existsSync(this.dbFilename)) {
            console.log('Database file does not exist. Creating a new one.');
            fs.writeFileSync(this.dbFilename, '');
        }
        // Open the database
        this.db = new Database(this.dbFilename);
        console.log('Database opened successfully.');
        // Initialize the database schema
        this.initializeDatabase();
    }
    /**
     * Initializes the database schema by creating the necessary tables.
     */
    initializeDatabase() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS events (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                date TEXT,
                owner TEXT,
                typeOfCancer TEXT,
                description TEXT,
                region TEXT,
                particularTopic TEXT,
                hasGeneratedList INTEGER NOT NULL CHECK (hasGeneratedList IN (0, 1))
        );
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                taskName TEXT NOT NULL,
                event TEXT NOT NULL,
                dueDate TEXT,
                description TEXT,
                comment TEXT,
                approver1 TEXT,
                approver2 TEXT,
                approver3 TEXT,
                assigner TEXT,
                assignee TEXT,
                isCompleted INTEGER NOT NULL CHECK (isCompleted IN (0, 1)),
                isApprovedByApprover1 INTEGER NOT NULL CHECK (isApprovedByApprover1 IN (0, 1)),
                isApprovedByApprover2 INTEGER NOT NULL CHECK (isApprovedByApprover2 IN (0, 1)),
                isApprovedByApprover3 INTEGER NOT NULL CHECK (isApprovedByApprover3 IN (0, 1)),
                FOREIGN KEY (event) REFERENCES events(id) ON DELETE CASCADE
            );
        `);
        console.log('Events and Tasks table created or already exists.');
    }
    /**
     * Adds a new task to the database.
     * @param task - The task object containing task details.
     * @returns A tuple containing the status code and a message.
     */
    addTask(task) {
        const sqlQuery = `
            INSERT INTO tasks (id, taskName, event, dueDate, description, comment, approver1, approver2, approver3, assigner, assignee, isCompleted, isApprovedByApprover1, isApprovedByApprover2, isApprovedByApprover3)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const stmt = this.db.prepare(sqlQuery);
            stmt.run(task.id, task.name, task.event, task.dueDate, task.description, task.comment, task.approver1, task.approver2, task.approver3, task.assigner, task.assignee, task.isCompleted, task.isApprovedByApprover1, task.isApprovedByApprover2, task.isApprovedByApprover3);
            console.log(`Task ${task.name} added successfully.`);
            return [200, `Task ${task.name} added.`];
        }
        catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
                console.error('Error inserting task:', error.message);
                return [409, `Task ${task.name} already exists.`];
            }
            if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
                console.error('Invalid event ID:', error.message);
                return [400, `Invalid event ID provided for task ${task.name}.`];
            }
            console.error('Error inserting task:', error.message);
            return [500, `An error occurred: ${error.message}`];
        }
    }
    /**
     * Retrieves a task from the database.
     * @param taskId - The id of the task to retrieve.
     * @returns A tuple containing the status code and the task object or an error message.
     */
    getTask(id) {
        try {
            const stmt = this.db.prepare(`
                SELECT *
                FROM tasks
                WHERE id = ?
            `);
            const task = stmt.get(id);
            ;
            if (!task) {
                return [404, 'Task not found'];
            }
            const resultingTask = {
                id: task.id,
                name: task.name,
                event: task.event,
                dueDate: task.dueDate,
                description: task.description,
                comment: task.comment,
                approver1: task.approver1,
                approver2: task.approver2,
                approver3: task.approver3,
                assigner: task.assigner,
                assignee: task.assignee,
                isCompleted: !!task.isCompleted,
                isApprovedByApprover1: !!task.isApprovedByApprover1,
                isApprovedByApprover2: !!task.isApprovedByApprover2,
                isApprovedByApprover3: !!task.isApprovedByApprover3,
            };
            return [200, resultingTask];
        }
        catch (error) {
            console.error('Error getting task:', error.message);
            return [500, `An error occurred: ${error.message}`];
        }
    }
    /**
     * Retrieves all tasks from the database.
     * @returns A tuple containing the status code and an array of tasks or an error message.
     */
    getAllTasks() {
        try {
            const stmt = this.db.prepare(`
                SELECT *
                FROM tasks
            `);
            const tasks = stmt.all();
            return [200, tasks];
        }
        catch (error) {
            console.error('Error getting all tasks:', error.message);
            return [500, `An error occurred: ${error.message}`];
        }
    }
    /**
     * Edits an existing task in the database.
     * @param taskId - The id of the task to edit.
     * @param newTask - The new task data to update.
     * @returns A tuple containing the status code and a message.
     */
    editTask(taskId, newTask) {
        const sqlQuery = `
            UPDATE tasks
            SET taskName = COALESCE(?, taskName),
                event = COALESCE(?, event),
                dueDate = COALESCE(?, dueDate),
                description = COALESCE(?, description),
                comment = COALESCE(?, comment),
                approver1 = COALESCE(?, approver1),
                approver2 = COALESCE(?, approver2),
                approver3 = COALESCE(?, approver3),
                assigner = COALESCE(?, assigner),
                assignee = COALESCE(?, assignee),
                isCompleted = COALESCE(?, isCompleted),
                isApprovedByApprover1 = COALESCE(?, isApprovedByApprover1),
                isApprovedByApprover2 = COALESCE(?, isApprovedByApprover2),
                isApprovedByApprover3 = COALESCE(?, isApprovedByApprover3)
            WHERE id = ?
        `;
        try {
            const stmt = this.db.prepare(sqlQuery);
            const result = stmt.run(newTask.name, newTask.event, newTask.dueDate, newTask.description, newTask.comment, newTask.approver1, newTask.approver2, newTask.approver3, newTask.assigner, newTask.assignee, newTask.isCompleted, newTask.isApprovedByApprover1, newTask.isApprovedByApprover2, newTask.isApprovedByApprover3, taskId);
            if (result.changes === 0) {
                return [404, `Task ${taskId} not found.`];
            }
            console.log(`Task ${taskId} updated successfully.`);
            return [200, `Task ${taskId} updated.`];
        }
        catch (error) {
            console.error('Error updating task:', error.message);
            return [500, `An error occurred: ${error.message}`];
        }
    }
    /**
     * Deletes a task from the database.
     * @param taskId - The id of the task to delete.
     * @returns A tuple containing the status code and a message.
     */
    deleteTask(taskId) {
        const sqlQuery = `
            DELETE FROM tasks
            WHERE id = ?
        `;
        try {
            const stmt = this.db.prepare(sqlQuery);
            const result = stmt.run(taskId);
            if (result.changes === 0) {
                return [404, `Task ${taskId} not found.`];
            }
            console.log(`Task ${taskId} deleted successfully.`);
            return [200, `Task ${taskId} deleted.`];
        }
        catch (error) {
            console.error('Error deleting task:', error.message);
            return [500, `An error occurred: ${error.message}`];
        }
    }
    /**
     * Retrieves all tasks with their ID, name, and isCompleted status.
     * @returns A tuple containing the status code and an array of tasks or an error message.
     */
    getAllTasksNamesAndStatus() {
        try {
            const stmt = this.db.prepare(`
                SELECT id, taskName, isCompleted
                FROM tasks
            `);
            const rows = stmt.all();
            const tasks = rows.map(row => ({
                id: row.id,
                name: row.taskName,
                isCompleted: row.isCompleted === 1, // Convert SQLite INTEGER to boolean
            }));
            return [200, tasks];
        }
        catch (error) {
            console.error('Error fetching tasks:', error.message);
            return [500, `An error occurred: ${error.message}`];
        }
    }
    /**
     * Adds a new event to the database.
     * @param event - The event object containing event details.
     * @returns A tuple containing the status code and a message.
     */
    addEvent(event) {
        const sqlQuery = `
            INSERT INTO events (id, title, date, owner, typeOfCancer, description, region, particularTopic, hasGeneratedList)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const stmt = this.db.prepare(sqlQuery);
            stmt.run(event.id, event.title, event.date, event.owner, event.typeOfCancer, event.description, event.region, event.particularTopic, event.hasGeneratedList);
            console.log(`Event ${event.title} added successfully.`);
            return [200, `Event ${event.title} added.`];
        }
        catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
                console.error('Error inserting event:', error.message);
                return [409, `Event ${event.title} already exists.`];
            }
            console.error('Error inserting event:', error.message);
            return [500, `An error occurred: ${error.message}`];
        }
    }
    /**
     * Retrieves an event from the database.
     * @param eventId - The ID of the event to retrieve.
     * @returns A tuple containing the status code and the event object or an error message.
     */
    getEvent(eventId) {
        try {
            const stmt = this.db.prepare(`
                SELECT *
                FROM events
                WHERE id = ?
            `);
            const event = stmt.get(eventId);
            if (!event) {
                return [404, 'Event not found'];
            }
            const resultingEvent = {
                id: event.id,
                title: event.title,
                date: event.date,
                owner: event.owner,
                typeOfCancer: event.typeOfCancer,
                description: event.description,
                region: event.region,
                particularTopic: event.particularTopic,
                hasGeneratedList: !!event.hasGeneratedList,
            };
            return [200, resultingEvent];
        }
        catch (error) {
            console.error('Error getting event:', error.message);
            return [500, `An error occurred: ${error.message}`];
        }
    }
    /**
     * Retrieves all events from the database.
     * @returns A tuple containing the status code and an array of events or an error message.
     */
    getAllEvents() {
        try {
            const stmt = this.db.prepare(`
                SELECT *
                FROM events
            `);
            const events = stmt.all();
            return [200, events.map(event => ({
                    id: event.id,
                    title: event.title,
                    date: event.date,
                    owner: event.owner,
                    typeOfCancer: event.typeOfCancer,
                    description: event.description,
                    region: event.region,
                    particularTopic: event.particularTopic,
                    hasGeneratedList: !!event.hasGeneratedList,
                }))];
        }
        catch (error) {
            console.error('Error getting all events:', error.message);
            return [500, `An error occurred: ${error.message}`];
        }
    }
    /**
     * Updates an existing event in the database.
     * @param eventId - The ID of the event to update.
     * @param newEvent - The new event data to update.
     * @returns A tuple containing the status code and a message.
     */
    editEvent(eventId, newEvent) {
        const sqlQuery = `
            UPDATE events
            SET title = COALESCE(?, title),
                date = COALESCE(?, date),
                owner = COALESCE(?, owner),
                typeOfCancer = COALESCE(?, typeOfCancer),
                description = COALESCE(?, description),
                region = COALESCE(?, region),
                particularTopic = COALESCE(?, particularTopic),
                hasGeneratedList = COALESCE(?, hasGeneratedList)
            WHERE id = ?
        `;
        try {
            const stmt = this.db.prepare(sqlQuery);
            const result = stmt.run(newEvent.title, newEvent.date, newEvent.owner, newEvent.typeOfCancer, newEvent.description, newEvent.region, newEvent.particularTopic, newEvent.hasGeneratedList, eventId);
            if (result.changes === 0) {
                return [404, `Event ${eventId} not found.`];
            }
            console.log(`Event ${eventId} updated successfully.`);
            return [200, `Event ${eventId} updated.`];
        }
        catch (error) {
            console.error('Error updating event:', error.message);
            return [500, `An error occurred: ${error.message}`];
        }
    }
    /**
     * Deletes an event from the database.
     * @param eventId - The ID of the event to delete.
     * @returns A tuple containing the status code and a message.
     */
    deleteEvent(eventId) {
        const sqlQuery = `
            DELETE FROM events
            WHERE id = ?
        `;
        try {
            const stmt = this.db.prepare(sqlQuery);
            const result = stmt.run(eventId);
            if (result.changes === 0) {
                return [404, `Event ${eventId} not found.`];
            }
            console.log(`Event ${eventId} deleted successfully.`);
            return [200, `Event ${eventId} deleted.`];
        }
        catch (error) {
            console.error('Error deleting event:', error.message);
            return [500, `An error occurred: ${error.message}`];
        }
    }
    /**
     * Retrieves all event names and their corresponding IDs from the database.
     * @returns A tuple containing the status code and an array of events or an error message.
     */
    getAllEventsNamesAndIds() {
        try {
            const stmt = this.db.prepare(`
                SELECT id, title
                FROM events
            `);
            const rows = stmt.all();
            const events = rows.map(row => ({ id: row.id, title: row.title }));
            return [200, events];
        }
        catch (error) {
            console.error('Error getting events:', error.message);
            return [500, `An error occurred: ${error.message}`];
        }
    }
    /**
     * Retrieves all events with their ID, title, and hasGeneratedList status.
     * @returns A tuple containing the status code and an array of events or an error message.
     */
    getAllEventSummaries() {
        try {
            const stmt = this.db.prepare(`
                SELECT id, title, hasGeneratedList
                FROM events
            `);
            const rows = stmt.all();
            ;
            const events = rows.map(row => ({
                id: row.id,
                title: row.title,
                hasGeneratedList: row.hasGeneratedList === 1, // Convert SQLite INTEGER to boolean
            }));
            return [200, events];
        }
        catch (error) {
            console.error('Error fetching events:', error.message);
            return [500, `An error occurred: ${error.message}`];
        }
    }
}
export default SQLiteContainer;
