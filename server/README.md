# Wallnote - Server side
[\< Back to main page](../)

A server written based on 
[Node js](https://nodejs.org/) using the 
[Express.js](https://expressjs.com/) and 
[Socket.io](https://socket.io/) frameworks.

This server uses 
[MongoDb](https://www.mongodb.com/) for database and data storage and its ODM is 
[Mongoose](https://mongoosejs.com/).

The information is sent to the server as a socket and then stored in a mesh database.

## Structure
This server contains the following folders

- Controller: files in this folder, have some modules that connect crud to routes
- Crud: in this folder we write files that manage database.
