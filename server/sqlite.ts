import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Task, Event, Donor, List } from './types';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';


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
            CREATE TABLE IF NOT EXISTS donors (
                donorId TEXT PRIMARY KEY,
                pmm TEXT,
                smm TEXT,
                vmm TEXT,
                exclude TEXT,
                deceased TEXT,
                first_name TEXT,
                nick_name TEXT,
                last_name TEXT,
                organization_name TEXT,
                total_donations INTEGER,
                total_pledge INTEGER,
                largest_gift INTEGER,
                largest_gift_appeal TEXT,
                first_gift_date INTEGER,
                last_gift_date INTEGER,
                last_gift_amount INTEGER,
                last_gift_request INTEGER,
                last_gift_appeal TEXT,
                address_line1 TEXT,
                address_line2 TEXT,
                city TEXT,
                contact_phone_type TEXT,
                phone_restrictions TEXT,
                email_restrictions TEXT,
                communication_restrictions TEXT,
                subscription_events_in_person TEXT,
                subscription_events_magazine TEXT,
                communication_preference TEXT,
                cancer_type TEXT
            );
            CREATE TABLE IF NOT EXISTS lists (
                listId TEXT PRIMARY KEY,
                generateDate TEXT,
                eventName TEXT,
                description TEXT
            );
            CREATE TABLE IF NOT EXISTS listDonor (
                listId TEXT NOT NULL,
                donorId TEXT NOT NULL,
                PRIMARY KEY (listId, donorId),
                FOREIGN KEY (listId) REFERENCES lists(listId) ON DELETE CASCADE,
                FOREIGN KEY (donorId) REFERENCES donors(donorId) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS events (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                date TEXT,
                owner TEXT,
                typeOfCancer TEXT,
                description TEXT,
                region TEXT,
                particularTopic TEXT,
                hasGeneratedList INTEGER NOT NULL CHECK (hasGeneratedList IN (0, 1)),
                listId TEXT,
                FOREIGN KEY (listId) REFERENCES lists(listId) ON DELETE CASCADE
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
        console.log('Tables created or already exists.');
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
            if ((error as any).code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
                console.error('Invalid event ID:', (error as Error).message);
                return [400, `Invalid event ID provided for task ${task.name}.`];
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


    /**
     * Retrieves all tasks with their ID, name, and isCompleted status.
     * @returns A tuple containing the status code and an array of tasks or an error message.
     */
    public getAllTasksNamesAndStatus(): [number, { id: string, name: string, isCompleted: boolean }[] | string] {
        try {
            const stmt = this.db.prepare(`
                SELECT id, taskName, isCompleted
                FROM tasks
            `);
            const rows = stmt.all() as { id: string, taskName: string, isCompleted: number }[];
            const tasks = rows.map(row => ({
                id: row.id,
                name: row.taskName,
                isCompleted: row.isCompleted === 1, // Convert SQLite INTEGER to boolean
            }));
            return [200, tasks];
        } catch (error) {
            console.error('Error fetching tasks:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }


    /**
     * Adds a new event to the database.
     * @param event - The event object containing event details (excluding id, hasGeneratedList, and listId).
     * @returns A tuple containing the status code and a message.
     */
    public addEvent(event: Omit<Event, 'id' | 'hasGeneratedList' | 'listId'>): [number, string] {
        const sqlQuery = `
        INSERT INTO events (id, title, date, owner, typeOfCancer, description, region, particularTopic, hasGeneratedList, listId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        try {
            const generatedId = uuidv4();
            const hasGeneratedList = 0;
            const listId = null;
            const stmt = this.db.prepare(sqlQuery);
            stmt.run(
                generatedId, event.title, event.date, event.owner,
                event.typeOfCancer, event.description, event.region,
                event.particularTopic, hasGeneratedList, listId
            );
            console.log(`Event ${event.title} added successfully with ID ${generatedId}.`);
            return [200, `Event ${event.title} added with ID ${generatedId}.`];
        } catch (error) {
            if ((error as any).code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
                console.error('Error inserting event:', (error as Error).message);
                return [409, `Event ${event.title} already exists.`];
            }
            console.error('Error inserting event:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }

    /**
     * Retrieves an event from the database.
     * @param eventId - The ID of the event to retrieve.
     * @returns A tuple containing the status code and the event object or an error message.
     */
    public getEvent(eventId: string): [number, Event | string] {
        try {
            const stmt = this.db.prepare(`
                SELECT *
                FROM events
                WHERE id = ?
            `);
            const event = stmt.get(eventId) as Event | undefined;
            if (!event) {
                return [404, 'Event not found'];
            }

            const resultingEvent: Event = {
                id: event.id,
                title: event.title,
                date: event.date,
                owner: event.owner,
                typeOfCancer: event.typeOfCancer,
                description: event.description,
                region: event.region,
                particularTopic: event.particularTopic,
                hasGeneratedList: !!event.hasGeneratedList,
                listId: event.listId
            };

            return [200, resultingEvent];
        } catch (error) {
            console.error('Error getting event:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }

    /**
     * Retrieves all events from the database.
     * @returns A tuple containing the status code and an array of events or an error message.
     */
    public getAllEvents(): [number, Event[] | string] {
        try {
            const stmt = this.db.prepare(`
                SELECT *
                FROM events
            `);
            const events = stmt.all() as Event[];
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
                listId: event.listId
            }))];
        } catch (error) {
            console.error('Error getting all events:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }

    /**
     * Updates an existing event in the database.
     * @param eventId - The ID of the event to update.
     * @param newEvent - The new event data to update.
     * @returns A tuple containing the status code and a message.
     */
    public editEvent(eventId: string, newEvent: Partial<Event>): [number, string] {
        const sqlQuery = `
            UPDATE events
            SET title = COALESCE(?, title),
                date = COALESCE(?, date),
                owner = COALESCE(?, owner),
                typeOfCancer = COALESCE(?, typeOfCancer),
                description = COALESCE(?, description),
                region = COALESCE(?, region),
                particularTopic = COALESCE(?, particularTopic),
                hasGeneratedList = COALESCE(?, hasGeneratedList),
                listId = COALESCE(?, listId)
            WHERE id = ?
        `;
        try {
            const stmt = this.db.prepare(sqlQuery);
            const result = stmt.run(
                newEvent.title, newEvent.date, newEvent.owner, newEvent.typeOfCancer,
                newEvent.description, newEvent.region, newEvent.particularTopic,
                newEvent.hasGeneratedList, newEvent.listId, eventId
            );
            if (result.changes === 0) {
                return [404, `Event ${eventId} not found.`];
            }
            console.log(`Event ${eventId} updated successfully.`);
            return [200, `Event ${eventId} updated.`];
        } catch (error) {
            console.error('Error updating event:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }

    /**
     * Deletes an event from the database.
     * @param eventId - The ID of the event to delete.
     * @returns A tuple containing the status code and a message.
     */
    public deleteEvent(eventId: string): [number, string] {
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
        } catch (error) {
            console.error('Error deleting event:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }

    /**
     * Retrieves all event names and their corresponding IDs from the database.
     * @returns A tuple containing the status code and an array of events or an error message.
     */
    public getAllEventsNamesAndIds(): [number, { id: string, title: string }[] | string] {
        try {
            const stmt = this.db.prepare(`
                SELECT id, title
                FROM events
            `);
            const rows = stmt.all() as { id: string, title: string }[];
            const events = rows.map(row => ({ id: row.id, title: row.title }));
            return [200, events];
        } catch (error) {
            console.error('Error getting events:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }

    /**
     * Retrieves all events with their ID, title, and hasGeneratedList status.
     * @returns A tuple containing the status code and an array of events or an error message.
     */
    public getAllEventSummaries(): [number, { id: string, title: string, hasGeneratedList: boolean }[] | string] {
        try {
            const stmt = this.db.prepare(`
                SELECT id, title, hasGeneratedList
                FROM events
            `);
            const rows = stmt.all() as { id: string, title: string, hasGeneratedList: number }[];;
            const events = rows.map(row => ({
                id: row.id,
                title: row.title,
                hasGeneratedList: row.hasGeneratedList === 1, // Convert SQLite INTEGER to boolean
            }));
            return [200, events];
        } catch (error) {
            console.error('Error fetching events:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }

    public insertDonor(donor: Donor): void {
        const stmt = this.db.prepare(`
            INSERT OR IGNORE INTO donors (
                donorId, pmm, smm, vmm, exclude, deceased, first_name, nick_name, last_name, 
                organization_name, total_donations, total_pledge, largest_gift, largest_gift_appeal, 
                first_gift_date, last_gift_date, last_gift_amount, last_gift_request, last_gift_appeal, 
                address_line1, address_line2, city, contact_phone_type, phone_restrictions, email_restrictions, 
                communication_restrictions, subscription_events_in_person, subscription_events_magazine, 
                communication_preference, cancer_type
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `);
        
        stmt.run(
            donor.donorId, donor.pmm, donor.smm, donor.vmm, donor.exclude, donor.deceased, donor.first_name, 
            donor.nick_name, donor.last_name, donor.organization_name, donor.total_donations, donor.total_pledge, 
            donor.largest_gift, donor.largest_gift_appeal, donor.first_gift_date, donor.last_gift_date, 
            donor.last_gift_amount, donor.last_gift_request, donor.last_gift_appeal, donor.address_line1, 
            donor.address_line2, donor.city, donor.contact_phone_type, donor.phone_restrictions, 
            donor.email_restrictions, donor.communication_restrictions, donor.subscription_events_in_person, 
            donor.subscription_events_magazine, donor.communication_preference, donor.cancer_type
        );
    }

    public insertList(listId: string): void {
        const stmt = this.db.prepare(`
            INSERT OR IGNORE INTO lists (listId, generateDate, eventName, description)
            VALUES (?, ?, ?, ?)
        `);
        stmt.run(listId, "", "", "");
    }

    public linkDonorToList(listId: string, donorId: string): void {
        const stmt = this.db.prepare(`
            INSERT OR IGNORE INTO listDonor (listId, donorId)
            VALUES (?, ?)
        `);
        stmt.run(listId, donorId);
    }

    public handleDonorListData(donorData: any, listId: string): void {
        // Insert list into the database
        this.insertList(listId);
    
        // Process each donor in the JSON data and insert them into the database
        // jsonData.forEach((donorData: any) => {
        //     // Generate a unique donorId for each donor
        const donorId = uuidv4();
            // const donor: Donor = {
            //     donorId: donorId,
            //     pmm: donorData.pmm,
            //     smm: donorData.smm,
            //     vmm: donorData.vmm,
            //     exclude: donorData.exclude,
            //     deceased: donorData.deceased,
            //     first_name: donorData.first_name,
            //     nick_name: donorData.nick_name,
            //     last_name: donorData.last_name,
            //     organization_name: donorData.organization_name,
            //     total_donations: donorData.total_donations,
            //     total_pledge: donorData.total_pledge,
            //     largest_gift: donorData.largest_gift,
            //     largest_gift_appeal: donorData.largest_gift_appeal,
            //     first_gift_date: donorData.first_gift_date,
            //     last_gift_date: donorData.last_gift_date,
            //     last_gift_amount: donorData.last_gift_amount,
            //     last_gift_request: donorData.last_gift_request,
            //     last_gift_appeal: donorData.last_gift_appeal,
            //     address_line1: donorData.address_line1,
            //     address_line2: donorData.address_line2,
            //     city: donorData.city,
            //     contact_phone_type: donorData.contact_phone_type,
            //     phone_restrictions: donorData.phone_restrictions,
            //     email_restrictions: donorData.email_restrictions,
            //     communication_restrictions: donorData.communication_restrictions,
            //     subscription_events_in_person: donorData.subscription_events_in_person,
            //     subscription_events_magazine: donorData.subscription_events_magazine,
            //     communication_preference: donorData.communication_preference,
            //     cancer_type: donorData.cancer_type
            // };
        const donor: Donor = {
            donorId: donorId,
            pmm: donorData[0],
            smm: donorData[1],
            vmm: donorData[2],
            exclude: donorData[3],
            deceased: donorData[4],
            first_name: donorData[5],
            nick_name: donorData[6],
            last_name: donorData[7],
            organization_name: donorData[8],
            total_donations: donorData[9],
            total_pledge: donorData[10],
            largest_gift: donorData[11],
            largest_gift_appeal: donorData[12],
            first_gift_date: donorData[13],
            last_gift_date: donorData[14],
            last_gift_amount: donorData[15],
            last_gift_request: donorData[16],
            last_gift_appeal: donorData[17],
            address_line1: donorData[18],
            address_line2: donorData[19],
            city: donorData[20],
            contact_phone_type: donorData[21],
            phone_restrictions: donorData[22],
            email_restrictions: donorData[23],
            communication_restrictions: donorData[24],
            subscription_events_in_person: donorData[25],
            subscription_events_magazine: donorData[26],
            communication_preference: donorData[27],
            cancer_type: donorData[28]
        };
    
            // Insert the donor into the donors table
            this.insertDonor(donor);
    
            // Link the donor to the list
            this.linkDonorToList(listId, donorId);
    }
    
    public getDonorsForEvent(eventId: string): any[] {
        const stmt = this.db.prepare(`
            SELECT donors.*
            FROM donors
            JOIN listDonor ON donors.donorId = listDonor.donorId
            WHERE listDonor.listId = (SELECT listId FROM events WHERE id = ?)
        `);
        return stmt.all(eventId);  // Return all donors for the event's list
    }
    
    
    public getList(listId: string): [number, List | string] {
        try {
            const stmt = this.db.prepare(`
                SELECT *
                FROM lists
                WHERE listId = ?
            `);
            const list = stmt.get(listId) as List | undefined;
            if (!list) {
                return [404, 'List not found'];
            }

            const resultingList: List = {
                listId: list.listId,
                generateDate: list.generateDate,
                eventName: list.eventName,
                description: list.description
            };

            return [200, resultingList];
        } catch (error) {
            console.error('Error getting list:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }

    public getAllLists(): [number, List[] | string] {
        try {
            const stmt = this.db.prepare(`
                SELECT *
                FROM lists
            `);
            const lists = stmt.all() as List[];
            return [200, lists.map(list => ({
                listId: list.listId,
                generateDate: list.generateDate,
                eventName: list.eventName,
                description: list.description
            }))];
        } catch (error) {
            console.error('Error getting all lists:', (error as Error).message);
            return [500, `An error occurred: ${(error as Error).message}`];
        }
    }


}

export default SQLiteContainer;