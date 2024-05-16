const OpenAI = require("openai");
const dotenv = require("dotenv");

const User = require("../models/User");

// create a new OAuth client used to verify google sign-in
dotenv.config();

const decideMode = async (req, res) => {
    const openai = new OpenAI({
        organization:
            process.env.OPENAI_OWNER === "user"
                ? req.body.openaiOrgId
                : process.env.OPENAI_ORG_ID,
        apiKey:
            process.env.OPENAI_OWNER === "user"
                ? req.body.openaiApiKey
                : process.env.OPENAI_API_KEY,
    });

    try {
        const numExpectedTotal = req.body.numExpectedTotal;
        const numFinished = req.body.numFinished;
        const numMostPromising = req.body.numMostPromising;
        const numPromising = req.body.numPromising;
        const numMax = req.body.numMax;
        const numMaxMinusOne = req.body.numMax - 1;

        const prompt = `### Inputs
We have to schedule a 30-minute meeting with ${numExpectedTotal} participants.
So far, ${numFinished} out of ${numExpectedTotal} participants indicated their availability as follows.

${Object.keys(req.body.selections)
    .map((time) => {
        const nameArr = req.body.selections[time];
        const names = nameArr
            .map((name) => name.substr(-2, 2).toUpperCase())
            .join(", ");
        const timeStr = new Date(parseInt(time)).toLocaleString();
        const verb = nameArr.length === 1 ? "is" : "are";
        return `On ${timeStr}, ${names} ${verb} available.`;
    })
    .join("\n")}

${
    numMax >= numFinished
        ? ""
        : `None of the times works for all ${numFinished} participants.`
}
There are ${numMostPromising} promising times that ${numMax} participants can attend.
There are ${numPromising} possible times that ${numMaxMinusOne} participants can attend.

### Question
Decide which times to show as options to the next participant.

If we show too many times, the next participant will be burdened with unnecessary information and might omit giving some information.
If we show too few times, there is a risk that we might lose the opportunity to find the optimal time that works for as many participants as possible. 

Therefore, rate how many time options we should show to the next participant as a score between 1 and 4 (inclusive). 
4 means we should show all options, and 1 means we should show only a few promising options.
Respond in JSON format with the score and reason like the example output below. Use specific numbers as evidence in the reason.

### Example Output
{"score": 1, "reason": "More than 90% of the participants have responded and we've narrowed down the promising times enough. There is more than one promising time, so it should be fine to show only the promising times to the next participant."}
{"score": 2, "reason": "More than 70% of participants have responded, so we've narrowed down the promising and possible times enough. But there are too few promising times, so we should show the possible times as well as promising times to the next participant."}
{"score": 3, "reason": "Although we were able to exclude certain times, only about 30% of the participants have responded. We should show many options to the next participant to gather more information."}
{"score": 4, "reason": "Less than 10% of the participants have responded and thus it is yet difficult to narrow down the promising or possible times. We should show all options to the next participant."}
`;

        console.log(prompt);
        let isJSON = false;
        let output = "";
        let outputJSON = {};

        while (!isJSON) {
            const result = await openai.chat.completions.create({
                messages: [{ role: "system", content: prompt }],
                model: "gpt-4-turbo",
                temperature: 0.1,
            });
            output = result.choices[0].message.content;
            console.log(output);
            try {
                if (output.startsWith("```")) {
                    const newOutput = output.substring(
                        output.indexOf("\n") + 1,
                        output.lastIndexOf("\n")
                    );
                    outputJSON = JSON.parse(newOutput);
                } else {
                    outputJSON = JSON.parse(output);
                }

                isJSON = true;
            } catch (err) {
                console.log(err);
            }
        }

        return res.status(200).send(outputJSON);
    } catch (err) {
        console.log(`Failed to decide mode: ${err}`);
        res.status(401).send({ err });
    }
};

// gets user from DB, or makes a new account if it doesn't exist yet
const getOrCreateUser = async (name) => {
    // the "sub" field means "subject", which is a unique identifier for each user
    const existingUser = await User.findOne({ name: name });

    if (existingUser) {
        return existingUser;
    }

    const newUser = new User({
        name: name || "",
    });
    await newUser.save();

    return newUser;
};

const login = async (req, res) => {
    try {
        const user = await getOrCreateUser(req.body.name);

        if (user) {
            req.session.user = user;
            await user.save();
            res.status(200).send(user);
        } else {
            res.status(404).send({ err: "No such user" });
        }
    } catch (err) {
        console.log(`Failed to log in: ${err}`);
        res.status(401).send({ err });
    }
};

function populateCurrentUser(req, res, next) {
    // simply populate "req.user" for convenience
    req.user = req.session.user;
    next();
}

module.exports = {
    login,
    populateCurrentUser,
    decideMode,
};
