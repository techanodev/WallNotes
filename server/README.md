# Wallnote - Server side
[\< Back to main page](/README.md)

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
- Dict: In this folder we define words for dictionary.
- Errors: We define error class type here for handle them in routes
- Services: Methods and some classes them has utils for make codes.
- Sockets: In this folder we have socket class handlers.
- Types: We define values types (Because we use typescript)

## Development
Clone project in your machine
```console
$ git clone https://github.com/abolfazlalz/WallNotes.git
```
> for this side, we use server folder.

Then create excludes dictionary words
```console
$ mkdir src/dict
$ mkdir src/dict/excludes
$ echo "export const badWords = [];" > src/dict/excludes.ts
```


After create excludes words, install project dependencies:
```console
$ yarn
```

make a copy from .env.example file for server enviroment and fill it with your own data such as your mongodb url
```console
$ cp .env.example .env
```

Then you can run project
```console
$ yarn dev
```

For build project run these command; these command build server side 
Typescript to Javascript
```console
$ yarn build
```

You can contribute to the development of this project by forging the repository and creating a pull request.

