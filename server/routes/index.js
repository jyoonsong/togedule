/*
|--------------------------------------------------------------------------
| index.js -- basic server routes
|--------------------------------------------------------------------------
|
*/

const express = require("express");

// import user library
const user = require("../controllers/user");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

router.post("/login", user.login);
router.post("/username", user.loginByUsername);
router.post("/signup", user.signup);
router.post("/decide", user.decideMode);
router.post("/names", user.getNames);
router.post("/update", user.updateUser);
router.post("/organizer", user.updateOrganizer);
router.get("/whoami", (req, res) => {
    if (!req.session.user) {
        // not logged in
        return res.status(200).send({});
    }

    res.status(200).send(req.session.user);
});

module.exports = router;
