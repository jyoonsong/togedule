/*
|--------------------------------------------------------------------------
| server.js -- The core of your server
|--------------------------------------------------------------------------
|
| This file defines how your server starts up. Think of it as the main() of your server.
| At a high level, this file does the following things:
| - Connect to the database
| - Sets up server middleware (i.e. addons that enable things like json parsing, user login)
| - Hooks up all the backend routes specified in api.js
| - Fowards frontend routes that should be handled by the React router
| - Sets up error handling in case something goes wrong when handling a request
| - Actually starts the webserver
*/

// validator runs some basic checks to make sure you've set everything up correctly
// this is a tool provided by staff, so you don't need to worry about it
const validator = require("../server/validator");
validator.checkSetup();

// import libraries needed for the webserver to work!
const http = require("http");
const express = require("express"); // backend framework for our node server.
const session = require("express-session"); // library that stores info about each connected user
const mongoose = require("mongoose"); // library to connect to MongoDB
const path = require("path"); // provide utilities for working with file and directory paths
const auth = require("../server/controllers/user");
const MongoStore = require("connect-mongo");

// routes
const indexRouter = require("../server/routes");
const eventRouter = require("../server/routes/event");

// Server configuration below
const mongoConnectionURL = process.env.MONGO_URL;
const databaseName = process.env.DB_NAME;

// connect to mongodb
const client = mongoose
    .connect(mongoConnectionURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: databaseName,
    })
    .then((m) => {
        console.log("Connected to MongoDB");
        return m.connection.getClient();
    })
    .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

// create a new express server
const app = express();
app.use(validator.checkRoutes);

// allow us to process POST requests
app.use(express.json());

// set up a session, which will persist login data across requests
app.use(
    session({
        secret: "togedule-secret",
        resave: false,
        saveUninitialized: false,
        proxy: true,
        cookie: {
            secure: true, // required for cookies to work on HTTPS
            httpOnly: false,
            sameSite: "none",
        },
        store: MongoStore.create({
            clientPromise: client,
            dbName: "sessions",
            autoRemove: "interval",
            autoRemoveInterval: 10, // Minutes
        }),
    })
);

// this checks if the user is logged in, and populates "req.user"
app.use(auth.populateCurrentUser);

// connect user-defined routes
app.use("/api", indexRouter);
app.use("/api/event", eventRouter);

// load the compiled react files, which will serve /index.html and /bundle.js
const reactPath = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(reactPath));

// for all other routes, render index.html and let react router handle it
app.get("*", (req, res) => {
    res.sendFile(path.join(reactPath, "index.html"));
});

// any server errors cause this function to run
app.use((err, req, res, next) => {
    const status = err.status || 500;
    if (status === 500) {
        // 500 means Internal Server Error
        console.log("The server errored when processing a request!");
        console.log(err);
    }

    res.status(status);
    res.send({
        status: status,
        message: err.message,
    });
});

// hardcode port to 3000 for now
const port = process.env.PORT || 3000;
const server = http.Server(app);

server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
