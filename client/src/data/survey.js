export const presurvey = [
    {
        index: 0,
        id: "gender",
        question: "Gender",
        multiple: false,
        options: ["Female", "Male", "Other"],
    },
    {
        index: 1,
        id: "freq_attendee",
        question: "How often do you attend a group meeting?",
        multiple: false,
        options: [
            "More than once a week",
            "Once a week",
            "Once in two weeks",
            "Once a month",
            "Less than once a month",
        ],
    },
    {
        index: 2,
        id: "freq_organizer",
        question: "How often do you organize a group meeting?",
        multiple: false,
        options: [
            "More than once a week",
            "Once a week",
            "Once in two weeks",
            "Once a month",
            "Less than once a month",
        ],
    },
    {
        index: 3,
        id: "tool",
        question:
            "What kind of tools do you use to schedule group meetings? (Select all that apply)",
        multiple: true,
        options: [
            "Email",
            "Calendly",
            "Doodle",
            "When2meet",
            "Google Calendar",
            "Other",
        ],
    },
    {
        index: 4,
        id: "familiar_calendar",
        question: "I am familiar with shared calendar tools like When2meet",
        multiple: false,
        options: [
            "Strongly agree",
            "Agree",
            "Neither agree nor disagree",
            "Disagree",
            "Strongly disagree",
        ],
    },
    {
        index: 5,
        id: "familiar_poll",
        question: "I am familiar with shared poll tools like Doodle",
        multiple: false,
        options: [
            "Strongly agree",
            "Agree",
            "Neither agree nor disagree",
            "Disagree",
            "Strongly disagree",
        ],
    },
    {
        index: 6,
        id: "trust",
        question: "I trust Artificial Intelligence (AI)",
        multiple: false,
        options: [
            "Strongly agree",
            "Agree",
            "Neither agree nor disagree",
            "Disagree",
            "Strongly disagree",
        ],
    },
];

export const postsurvey_common = [
    {
        index: 0,
        id: "tlx_mental",
        question: "Mental Demand: How mentally demanding was the task?",
        multiple: false,
        options: [
            "Very low",
            "Somewhat low",
            "Neither low nor high",
            "Somewhat high",
            "Very high",
        ],
    },
    {
        index: 1,
        id: "tlx_physical",
        question: "Physical Demand: How physically demanding was the task?",
        options: [
            "Very low",
            "Somewhat low",
            "Moderate",
            "Somewhat high",
            "Very high",
        ],
    },
    {
        index: 2,
        id: "tlx_temporal",
        question:
            "Temporal Demand: How hurried or rushed was the pace of the task?",
        options: [
            "Very low",
            "Somewhat low",
            "Moderate",
            "Somewhat high",
            "Very high",
        ],
    },
    {
        index: 3,
        id: "tlx_performance",
        question:
            "Performance: How successful were you in accomplishing what you were asked to do?",
        options: [
            "Very Successful",
            "Somewhat Successful",
            "Neither Successful nor Unsuccessful",
            "Somewhat Unsuccessful",
            "Very Unsuccessful",
        ],
    },
    {
        index: 4,
        id: "tlx_effort",
        question:
            "Effort: How hard did you have to work to accomplish your level of performance?",
        options: [
            "Very low",
            "Somewhat low",
            "Moderate",
            "Somewhat high",
            "Very high",
        ],
    },
    {
        index: 5,
        id: "tlx_frustration",
        question: "Frustration: How stressed were you during the task?",
        options: [
            "Very low",
            "Somewhat low",
            "Neither low nor high",
            "Somewhat high",
            "Very high",
        ],
    },
    {
        index: 6,
        id: "ease",
        question: "The system was easy to use.",
        multiple: false,
        options: [
            "Strongly agree",
            "Agree",
            "Neither agree nor disagree",
            "Disagree",
            "Strongly disagree",
        ],
    },
];

export const postsurvey_attendee = [
    {
        index: 7,
        id: "useful_attendee",
        question: "The system was useful in indicating my schedule.",
        multiple: false,
        options: [
            "Strongly agree",
            "Agree",
            "Neither agree nor disagree",
            "Disagree",
            "Strongly disagree",
        ],
    },
    {
        index: 8,
        id: "preference_attendee",
        question:
            "The system helped me express my preference between different times.",
        multiple: false,
        options: [
            "Strongly agree",
            "Agree",
            "Neither agree nor disagree",
            "Disagree",
            "Strongly disagree",
        ],
    },
    {
        index: 9,
        id: "words_attendee",
        question: "I tried to select popular times as much as possible",
        multiple: false,
        options: [
            "Strongly agree",
            "Agree",
            "Neither agree nor disagree",
            "Disagree",
            "Strongly disagree",
        ],
    },
    {
        index: 10,
        id: "rationale_attendee",
        question:
            "Please describe the process how you indicated your schedule.",
        multiple: false,
        text: true,
    },
    {
        index: 11,
        id: "like_attendee",
        question: "What did you like about the system?",
        multiple: false,
        text: true,
    },
    {
        index: 12,
        id: "dislike_attendee",
        question: "What did you NOT like about the system?",
        multiple: false,
        text: true,
    },
];

export const postsurvey_organizer = [
    {
        index: 7,
        id: "useful_organizer",
        question: "The system was useful in deciding the time to meet.",
        multiple: false,
        options: [
            "Strongly agree",
            "Agree",
            "Neither agree nor disagree",
            "Disagree",
            "Strongly disagree",
        ],
    },
    {
        index: 8,
        id: "priority_organizer",
        question:
            "The system helped me consider the priority of each attendee in making decision.",
        multiple: false,
        options: [
            "Strongly agree",
            "Agree",
            "Neither agree nor disagree",
            "Disagree",
            "Strongly disagree",
        ],
    },
    {
        index: 9,
        id: "preference_organizer",
        question:
            "The system helped me consider the preference of each attendee in making decision.",
        multiple: false,
        options: [
            "Strongly agree",
            "Agree",
            "Neither agree nor disagree",
            "Disagree",
            "Strongly disagree",
        ],
    },
    {
        index: 10,
        id: "rationale_organizer",
        question:
            "Please describe the process how you decided the time to meet.",
        multiple: false,
        text: true,
    },
    {
        index: 11,
        id: "like_organizer",
        question: "What did you like about the system?",
        multiple: false,
        text: true,
    },
    {
        index: 12,
        id: "like_organizer",
        question: "What did you NOT like about the system?",
        multiple: false,
        text: true,
    },
];
