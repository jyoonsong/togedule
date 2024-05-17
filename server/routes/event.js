/*
|--------------------------------------------------------------------------
| story.js -- server routes relevant to stories
|--------------------------------------------------------------------------
|
*/

const express = require("express");

// import authentication library
const event_controller = require("../controllers/event");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

router.post("/create", event_controller.createEvent);
router.get("/get/:id", event_controller.getEvent);
router.post("/events", event_controller.getEvents);
router.post("/name", event_controller.updateName);
router.post("/selections/:id", event_controller.updateSelections);
router.post("/maybes/:id", event_controller.updateMaybes);
router.post("/both/:id", event_controller.updateBoth);
router.post("/priority/:id", event_controller.savePriority);
router.post("/note/:group", event_controller.saveNote);

module.exports = router;
