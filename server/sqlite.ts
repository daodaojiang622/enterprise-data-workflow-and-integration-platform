import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Task } from '../src/Screens/Task';
import { fileURLToPath } from 'url';


/**
 * Class representing a SQLite container for managing tasks and comments.
 */
class SQLiteContainer {
    private db: Database.Database;
    private dbFilename: string;

    /**
     * Constructor for SQLiteContainer.
     * @param database - The name of the database file.
     */
    constructor(database: string) {
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
    private initializeDatabase() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                taskName TEXT,
                event TEXT,
                dueDate TEXT,
                description TEXT,
                comment TEXT,
                approver1 TEXT,
                approver2 TEXT,
                approver3 TEXT,
                assigner TEXT,
                assignee TEXT,
                isCompleted INTEGER,
                isApprovedByApprover1 INTEGER,
                isApprovedByApprover2 INTEGER,
                isApprovedByApprover3 INTEGER
            );
        `);
        console.log('Tasks table created or already exists.');
    }

    /**
     * Adds a new task to the database.
     * @param task - The task object containing task details.
     * @returns A tuple containing the status code and a message.
     */
    public addTask(task: Task): [number, string] {
        const sqlQuery = `
            INSERT INTO tasks (id, taskName, event, dueDate, description, comment, approver1, approver2, approver3, assigner, assignee, isCompleted, isApprovedByApprover1, isApprovedByApprover2, isApprovedByApprover3)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const stmt = this.db.prepare(sqlQuery);
            stmt.run(
                task.id, task.name, task.event, task.dueDate, task.description, task.comment,
                task.approver1, task.approver2, task.approver3, task.assigner, 
                task.assignee, task.isCompleted, task.isApprovedByApprover1, 
                task.isApprovedByApprover2, task.isApprovedByApprover3
            );
            console.log(`Task ${task.name} added successfully.`);
            return [200, `Task ${task.name} added.`];
        } catch (error) {
            if ((error as any).code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
                console.error('Error inserting task:', (error as Error).message);
                return [409, `Task ${task.name} already exists.`];
            }
            console.error('Error inserting task:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }
    

    /**
     * Retrieves a task from the database.
     * @param taskId - The id of the task to retrieve.
     * @returns A tuple containing the status code and the task object or an error message.
     */
    getTask(id: string): [number, Task | string] {
        try {
            const stmt = this.db.prepare(`
                SELECT *
                FROM tasks
                WHERE id = ?
            `);
            const task = stmt.get(id) as Task | undefined;;
            if (!task) {
                return [404, 'Task not found'];
            }

            const resultingTask: Task = {
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
        } catch (error) {
            console.error('Error getting task:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }
    

    /**
     * Retrieves all tasks from the database.
     * @returns A tuple containing the status code and an array of tasks or an error message.
     */
    getAllTasks(): [number, Task[] | string] {
        try {
            const stmt = this.db.prepare(`
                SELECT *
                FROM tasks
            `);
            const tasks = stmt.all() as Task[];
            return [200, tasks];
        } catch (error) {
            console.error('Error getting all tasks:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }
    
    /**
     * Edits an existing task in the database.
     * @param taskId - The id of the task to edit.
     * @param newTask - The new task data to update.
     * @returns A tuple containing the status code and a message.
     */
    public editTask(taskId: string, newTask: Partial<Task>): [number, string] {
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
            const result = stmt.run(
                newTask.name, newTask.event, newTask.dueDate, newTask.description, newTask.comment,
                newTask.approver1, newTask.approver2, newTask.approver3, newTask.assigner, 
                newTask.assignee, newTask.isCompleted, newTask.isApprovedByApprover1, 
                newTask.isApprovedByApprover2, newTask.isApprovedByApprover3, taskId
            );
            if (result.changes === 0) {
                return [404, `Task ${taskId} not found.`];
            }
            console.log(`Task ${taskId} updated successfully.`);
            return [200, `Task ${taskId} updated.`];
        } catch (error) {
            console.error('Error updating task:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }


    /**
     * Deletes a task from the database.
     * @param taskId - The id of the task to delete.
     * @returns A tuple containing the status code and a message.
     */
    public deleteTask(taskId: string): [number, string] {
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
        } catch (error) {
            console.error('Error deleting task:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }
    
}

export default SQLiteContainer;