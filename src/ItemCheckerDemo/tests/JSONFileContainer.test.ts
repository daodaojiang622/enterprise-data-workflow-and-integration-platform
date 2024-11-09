import { TaskSchema } from '../../types';
import { runTaskManagerTests } from './TaskManagerTestRunner';
import JSONFileContainer from '../src/JSONFileContainer';

import * as fs from 'fs';
import * as path from 'path';
import { after } from 'node:test';
import { clear } from 'console';

const documentTestPath = 'testdocuments';
const databaseRootLocation: string = path.join(__dirname, '..', 'jsonDB');


/**
 * Recursively delete files in a directory and then delete the directory itself.
 * @param dirPath - The path of the directory to delete.
 */
function deleteDirectoryRecursively(dirPath: string) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const filePath = path.join(dirPath, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                // Recursively delete files in the subdirectory
                deleteDirectoryRecursively(filePath);
            } else {
                // Delete the file
                fs.unlinkSync(filePath);
            }
        });
        // Delete the directory itself
        fs.rmdirSync(dirPath);
    }
}

// modified to delete everything including the directory to test for line 19
const clearTestDatabases = () => {
    if (fs.existsSync(databaseRootLocation)) {
        deleteDirectoryRecursively(databaseRootLocation);
    }
};

beforeAll(() => {
    clearTestDatabases();
});

afterAll(() => {
    clearTestDatabases();
});


// the tests here are for the implementation and as such will do thinks like check for the 
// existence of files and directories and the contents of files.  These tests will not be 
// testing the functionality of the class.
describe('ListManagerImplementation', () => {
    test('constructor should create a directory for the database', () => {

        const listManager = new JSONFileContainer('database1');

        const expectedDBLocation = path.join(databaseRootLocation, 'database1');
        expect(fs.existsSync(expectedDBLocation)).toBeTruthy();

    });

    // test for 30 - 35
    test('readJsonFile should read and parse a JSON file into a TaskSchema object', () => {
        // Arrange
        const container = new JSONFileContainer('database1');
        const testFilePath = path.join(databaseRootLocation, 'test.json');
        const testData: TaskSchema = { 
            taskName: 'Test Task', 
            taskDescription: 'This is a test task.', 
            approver1: 'test', 
            approver2: 'test', 
            approver3: 'test', 
            comments: ['test', 't'], 
            decisionMaker: 'test', 
            recommendation: 'test' 
        };
        fs.writeFileSync(testFilePath, JSON.stringify(testData));
    
        // Act
        const result = container['readJsonFile'](testFilePath);
    
        // Assert
        expect(result).toEqual(testData);
    
        // Clean up
        fs.unlinkSync(testFilePath);
    });

    // test for 36 - 37
    test('readJsonFile should catch error and return null when there is no file path', () => {
        // Arrange
        const container = new JSONFileContainer('database1');
    
        // Act
        const result = container['readJsonFile']('nonexistent.json');
    
        // Assert
        expect(result).toBeNull();
    });

        // test for 42 - 45
        test('writeJsonFile should write a TaskSchema object to a JSON file', () => {
            // Arrange
            const container = new JSONFileContainer('database1');
            const testFilePath = path.join(databaseRootLocation, 'test.json');
            const testData: TaskSchema = { 
                taskName: 'Test Task', 
                taskDescription: 'This is a test task.', 
                approver1: 'test', 
                approver2: 'test', 
                approver3: 'test', 
                comments: ['test', 't'], 
                decisionMaker: 'test', 
                recommendation: 'test' 
            };
        
            // Act
            container['writeJsonFile'](testFilePath, testData);
        
            // Assert
            expect(fs.existsSync(testFilePath)).toBeTruthy();
        
            // Clean up
            fs.unlinkSync(testFilePath);
        });

        //test for 46 - 47
        test('writeJsonFile should catch error and log it when there is an error writing the file', () => {
            // Arrange
            const container = new JSONFileContainer('database1');
            const testFilePath = path.join(databaseRootLocation, 'test.json');
            const testData: TaskSchema = { 
                taskName: 'Test Task', 
                taskDescription: 'This is a test task.', 
                approver1: 'test', 
                approver2: 'test', 
                approver3: 'test', 
                comments: ['test', 't'], 
                decisionMaker: 'test', 
                recommendation: 'test' 
            };
            fs.writeFileSync(testFilePath, JSON.stringify(testData));
            fs.chmodSync(testFilePath, 0o444);

        
            // Act
            container['writeJsonFile'](testFilePath, testData);
        
            // Assert
            expect(fs.existsSync(testFilePath)).toBeTruthy();
        
            // Clean up
            fs.unlinkSync(testFilePath);
        });

        // test for 53
        test('getAllTasks should return a 404 when 0 tasks are found', async () => {
            // Arrange
            const databaseName = 'nonExistentDatabase';
            const container = new JSONFileContainer(databaseName);

            // Ensure the directory does not exist before the test
            const databaseLocation = path.join(databaseRootLocation, databaseName);
            if (fs.existsSync(databaseLocation)) {
                deleteDirectoryRecursively(databaseLocation);
            }
            // Act
            const result = container.getAllTasks();
        
            // Assert
            expect(result).toEqual([404, 'No tasks found.']);
        });

        // test for 81
        test('getTask should return a 404 when the task does not exist', async () => {
            // Arrange
            const container = new JSONFileContainer('database1');
            const taskName = 'NonExistentTask';
            const expectedResponse = [404, `Task ${taskName} not found.`];

            // Act
            const result = container.getTask(taskName, 'test');

            // Assert
            expect(result).toEqual(expectedResponse);
        });

        // test for 82
        test('getTask should return 200 and the task when the task exists', async () => {
            // Arrange
            const databaseName = 'database1';
            const container = new JSONFileContainer(databaseName);
            const task: TaskSchema = { 
                taskName: 'Test Task', 
                taskDescription: 'This is a test task.', 
                approver1: 'test', 
                approver2: 'test', 
                approver3: 'test', 
                comments: ['test', 't'], 
                decisionMaker: 'test', 
                recommendation: 'test' 
            };
            const testFilePath = path.join(databaseRootLocation, databaseName, 'Test Task.json');
            container['writeJsonFile'](testFilePath, task);
        
            // Act
            const result = container.getTask('Test Task', 'test');
        
            // Assert
            expect(result).toEqual([200, task]);
        
            // Clean up
            fs.unlinkSync(testFilePath);
            });

        // test 101
        test('addComment should return a 404 when the task does not exist', async () => {
            // Arrange
            const container = new JSONFileContainer('database1');
            const taskName = 'NonExistentTask';
            const expectedResponse = [404, `Task ${taskName} not found.`];
    
            // Act
            const result = container.addComment(taskName, 'test', 'test');
    
            // Assert
            expect(result).toEqual(expectedResponse);
        });

});



runTaskManagerTests((name: string) => new JSONFileContainer(name));