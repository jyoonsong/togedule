const Event = require("../models/Event");
const User = require("../models/User");
const { createUser } = require("./user");

const updateBoth = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            const filtered = event.maybes.filter(
                (sel) => sel.user_id !== req.session.user?._id
            );
            const newMaybe = [
                ...filtered,
                {
                    user_id: req.session.user?._id || "null",
                    name: req.session.user?.name,
                    selection: req.body.maybe,
                },
            ];
            event.maybes = newMaybe;

            const filtered2 = event.selections.filter(
                (sel) => sel.user_id !== req.session.user?._id
            );
            const newSelection = [
                ...filtered2,
                {
                    user_id: req.session.user?._id || "null",
                    name: req.session.user?.name,
                    selection: req.body.selection,
                },
            ];
            event.selections = newSelection;

            await event.save();

            res.status(200).send({ ...event._doc, success: true });
        } else {
            res.status(404).send({ err: "No such event" });
        }
    } catch (err) {
        console.log(`Failed to update selections and maybes: ${err}`);
        res.status(401).send({ err });
    }
};

const updateMaybes = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            delete event.__v;
            delete req.body.__v;

            const filtered = event.maybes.filter(
                (sel) => sel.user_id !== req.session.user?._id
            );
            const newMaybe = [
                ...filtered,
                {
                    user_id: req.session.user?._id || "null",
                    name: req.session.user?.name,
                    selection: req.body.selection,
                },
            ];
            event.maybes = newMaybe;
            await event.save();

            res.status(200).send({ ...event._doc, success: true });
        } else {
            res.status(404).send({ err: "No such event" });
        }
    } catch (err) {
        console.log(`Failed to update maybes: ${err}`);
        res.status(401).send({ err });
    }
};

const updateSelections = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            delete event.__v;
            delete req.body.__v;

            const filtered = event.selections.filter(
                (sel) => sel.user_id !== req.session.user?._id
            );
            const newSelection = [
                ...filtered,
                {
                    user_id: req.session.user?._id || "null",
                    name: req.session.user?.name,
                    selection: req.body.selection,
                    note: req.body.note,
                },
            ];
            event.selections = newSelection;
            await event.save();

            res.status(200).send({ ...event._doc, success: true });
        } else {
            res.status(404).send({ err: "No such event" });
        }
    } catch (err) {
        console.log(`Failed to update selections: ${err}`);
        res.status(401).send({ err });
    }
};

const updateName = async (req, res) => {
    try {
        // update name
        const user = await User.findById(req.session.user?._id);
        user.name = req.body.name;
        const foundEvent = user.attendingEvents.find((e) =>
            e.equals(req.body.eventId)
        );
        if (!foundEvent) {
            user.attendingEvents = [...user.attendingEvents, req.body.eventId];
        }
        await user.save();
        req.session.user = user;

        const event = await Event.findById(req.body.eventId);
        const found = event.attendees.find((a) => a.equals(user._id));
        if (!found) {
            event.attendees = [...event.attendees, user._id];
            await event.save();
        }

        return res.status(200).send({ numAttendees: event.attendees.length });
    } catch (err) {
        console.log(`Failed to update name: ${err}`);
        res.status(401).send({ err });
    }
};

const createEvent = async (req, res) => {
    try {
        if (!req.session.user) {
            // create user
            const user = await createUser("");
            req.session.user = user;
        }

        // create log
        const newEvent = new Event({
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            dates: req.body.dates,
            duration: req.body.duration,
            organizer: req.session.user?._id,
            selections: [],
            maybes: [],
            priority: [],

            title: req.body.title,
            password: req.body.password,
            total: req.body.total,
        });
        await newEvent.save();

        const currentUser = await User.findById(req.session.user?._id);
        const newOrganizingEvents = [
            ...currentUser.organizingEvents,
            newEvent._id,
        ];
        currentUser.organizingEvents = newOrganizingEvents;
        await currentUser.save();
        req.session.user = currentUser;

        res.status(200).send({ ...newEvent._doc, success: true });
    } catch (err) {
        console.log(`Failed to create a event: ${err}`);
        res.status(401).send({ err });
    }
};

const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.status(200).send(event);
    } catch (err) {
        console.log(`Failed to get event: ${err}`);
        res.status(401).send({ err });
    }
};

const getEvents = async (req, res) => {
    try {
        const events = [];
        for (let id of req.body.ids) {
            if (id?.length > 0) {
                const event = await Event.findById(id);
                if (event) {
                    events.push({
                        _id: event._id,
                        title: event.title,
                        password: event.password,
                        total: event.total,
                        numAttendees: event.attendees.length,
                    });
                }
            }
        }
        return res.status(200).send(events);
    } catch (err) {
        console.log(`Failed to get events: ${err}`);
        res.status(401).send({ err });
    }
};

const savePriority = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        event.priority = req.body.priority;
        await event.save();
        res.status(200).send(event);
    } catch (err) {
        console.log(`Failed to save priority: ${err}`);
        res.status(401).send({ err });
    }
};

const saveNote = async (req, res) => {
    try {
        const event = await Event.findOne({ group: req.params.group });

        const mySelection = event.selections.filter(
            (sel) => sel.name === req.session.user.name
        );
        const otherSelections = event.selections.filter(
            (sel) => sel.name !== req.session.user.name
        );
        let newSelection;
        if (mySelection.length > 0) {
            newSelection = mySelection[0];
            newSelection.note = req.body.note;
        } else {
            newSelection = {
                user_id: req.session.user._id,
                name: req.session.user.name,
                selection: [],
                note: req.body.note,
            };
        }
        event.selections = [...otherSelections, newSelection];

        await event.save();

        res.status(200).send(event);
    } catch (err) {
        console.log(`Failed to save words: ${err}`);
        res.status(401).send({ err });
    }
};

module.exports = {
    updateBoth,
    updateMaybes,
    updateSelections,
    updateName,
    createEvent,
    getEvent,
    savePriority,
    saveNote,
    getEvents,
};
