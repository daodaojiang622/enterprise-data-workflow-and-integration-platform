To run server:
1. make sure your current directory is at ./server
2. run `npm install`, `npm start` 


To convert .ts into .js:
1. run `npx tsc`
2. modify the import line in server.js to `import SQLiteContainer from './sqlite.js';`