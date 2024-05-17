const RED = "#c92a2a";
const ORANGE = "#f76707";
const YELLOW = "#fab005";

// 0 more busy & AM: Mon 3 Tue 2 Wed 3 Thurs 2 : RED 3 ORANGE 4 YELLOW 3
// 1 more busy & AM: Mon 3 Tue 2 Wed 2 Thurs 3 : RED 3 ORANGE 3 YELLOW 4
// 2 more busy & PM: Mon 2 Tue 3 Wed 3 Thurs 2 : RED 4 ORANGE 3 YELLOW 3
// 3 more busy & PM: Mon 2 Tue 3 Wed 2 Thurs 3 : RED 4 ORANGE 3 YELLOW 3

// 4 less busy & AM: Mon 2 Tue 1 Wed 1 Thurs 1 : RED 2 ORANGE 1 YELLOW 2
// 5 less busy & AM: Mon 1 Tue 2 Wed 1 Thurs 1 : RED 1 ORANGE 2 YELLOW 2
// 6 less busy & PM: Mon 1 Tue 1 Wed 2 Thurs 1 : RED 1 ORANGE 2 YELLOW 2
// 7 less busy & PM: Mon 1 Tue 1 Wed 1 Thurs 2 : RED 2 ORANGE 2 YELLOW 1

export const scheduleData = [
    // 0
    [
        // Mon
        {
            startDate: "2022-09-19T09:30",
            endDate: "2022-09-19T11:00",
            title: "Meeting",
            color: RED,
        },
        {
            startDate: "2022-09-19T11:30",
            endDate: "2022-09-19T13:00",
            title: "Go to gym (Tentative)",
            color: YELLOW,
        },
        {
            startDate: "2022-09-19T18:00",
            endDate: "2022-09-19T19:30",
            title: "Dinner with Mom",
            color: ORANGE,
        },
        // Tue
        {
            startDate: "2022-09-20T11:00",
            endDate: "2022-09-20T12:30",
            title: "Meet Amy (Tentative)",
            color: YELLOW,
        },
        {
            startDate: "2022-09-20T19:00",
            endDate: "2022-09-20T20:30",
            title: "Meeting",
            color: RED,
        },
        // Wed
        {
            startDate: "2022-09-21T09:30",
            endDate: "2022-09-21T11:00",
            title: "Conference",
            color: ORANGE,
        },
        {
            startDate: "2022-09-21T11:30",
            endDate: "2022-09-21T13:00",
            title: "Symposium",
            color: YELLOW,
        },
        {
            startDate: "2022-09-21T18:30",
            endDate: "2022-09-21T20:00",
            title: "Dinner with John",
            color: ORANGE,
        },
        // Thurs
        {
            startDate: "2022-09-22T10:00",
            endDate: "2022-09-22T11:30",
            title: "Meeting",
            color: RED,
        },
        {
            startDate: "2022-09-22T19:00",
            endDate: "2022-09-22T20:30",
            title: "Workshop",
            color: ORANGE,
        },
    ],
    // 1
    [
        // Mon
        {
            startDate: "2022-09-19T09:00",
            endDate: "2022-09-19T10:30",
            title: "Yoga (Tentative)",
            color: YELLOW,
        },
        {
            startDate: "2022-09-19T11:00",
            endDate: "2022-09-19T12:30",
            title: "Meeting",
            color: ORANGE,
        },
        {
            startDate: "2022-09-19T18:30",
            endDate: "2022-09-19T20:00",
            title: "Dinner with Mom",
            color: RED,
        },
        // Tue
        {
            startDate: "2022-09-20T10:30",
            endDate: "2022-09-20T12:00",
            title: "Conference",
            color: ORANGE,
        },
        {
            startDate: "2022-09-20T14:00",
            endDate: "2022-09-20T15:30",
            title: "Meeting",
            color: RED,
        },
        // Wed
        {
            startDate: "2022-09-21T09:00",
            endDate: "2022-09-21T10:30",
            title: "Meet Anna (Tentative)",
            color: YELLOW,
        },
        {
            startDate: "2022-09-21T11:00",
            endDate: "2022-09-21T12:30",
            title: "Symposium",
            color: YELLOW,
        },
        // Thurs
        {
            startDate: "2022-09-22T09:30",
            endDate: "2022-09-22T11:00",
            title: "Lunch with John",
            color: RED,
        },
        {
            startDate: "2022-09-22T11:30",
            endDate: "2022-09-22T13:00",
            title: "Meeting",
            color: YELLOW,
        },
        {
            startDate: "2022-09-22T19:30",
            endDate: "2022-09-22T21:00",
            title: "Dinner with Amy",
            color: ORANGE,
        },
    ],
    // 2
    [
        // Mon
        {
            startDate: "2022-09-19T11:00",
            endDate: "2022-09-19T12:30",
            title: "Meeting (Tentative)",
            color: YELLOW,
        },
        {
            startDate: "2022-09-19T15:00",
            endDate: "2022-09-19T16:30",
            title: "Meeting",
            color: RED,
        },
        // Tue
        {
            startDate: "2022-09-20T09:30",
            endDate: "2022-09-20T11:00",
            title: "Meeting (Tentative)",
            color: YELLOW,
        },
        {
            startDate: "2022-09-20T15:00",
            endDate: "2022-09-20T16:30",
            title: "Meet John",
            color: RED,
        },
        {
            startDate: "2022-09-20T17:00",
            endDate: "2022-09-20T18:30",
            title: "Meeting",
            color: ORANGE,
        },
        // Wed
        {
            startDate: "2022-09-21T14:00",
            endDate: "2022-09-21T15:30",
            title: "Conference",
            color: RED,
        },
        {
            startDate: "2022-09-21T16:00",
            endDate: "2022-09-21T17:30",
            title: "Symposium",
            color: RED,
        },
        {
            startDate: "2022-09-21T19:30",
            endDate: "2022-09-21T21:00",
            title: "Party",
            color: ORANGE,
        },
        // Thurs
        {
            startDate: "2022-09-22T15:00",
            endDate: "2022-09-22T16:30",
            title: "Meeting",
            color: YELLOW,
        },
        {
            startDate: "2022-09-22T17:30",
            endDate: "2022-09-22T19:00",
            title: "Interview",
            color: ORANGE,
        },
    ],
    // 3
    [
        // Mon
        {
            startDate: "2022-09-19T13:00",
            endDate: "2022-09-19T14:30",
            title: "Meeting",
            color: RED,
        },
        {
            startDate: "2022-09-19T15:30",
            endDate: "2022-09-19T17:00",
            title: "Gym (Tentative)",
            color: YELLOW,
        },
        // Tue
        {
            startDate: "2022-09-20T12:30",
            endDate: "2022-09-20T14:00",
            title: "Meet John",
            color: ORANGE,
        },
        {
            startDate: "2022-09-20T15:30",
            endDate: "2022-09-20T17:00",
            title: "Conference",
            color: ORANGE,
        },
        {
            startDate: "2022-09-20T19:30",
            endDate: "2022-09-20T21:00",
            title: "Meeting (Tentative)",
            color: YELLOW,
        },
        // Wed
        {
            startDate: "2022-09-21T15:00",
            endDate: "2022-09-21T16:30",
            title: "Conference",
            color: RED,
        },
        {
            startDate: "2022-09-21T17:00",
            endDate: "2022-09-21T18:30",
            title: "Symposium",
            color: RED,
        },
        // Thurs
        {
            startDate: "2022-09-22T10:30",
            endDate: "2022-09-22T12:00",
            title: "Meeting",
            color: YELLOW,
        },
        {
            startDate: "2022-09-22T15:00",
            endDate: "2022-09-22T16:30",
            title: "Meet Anna",
            color: ORANGE,
        },
        {
            startDate: "2022-09-22T17:30",
            endDate: "2022-09-22T19:00",
            title: "Interview",
            color: RED,
        },
    ],
    // 4
    [
        // Mon
        {
            startDate: "2022-09-19T09:30",
            endDate: "2022-09-19T11:00",
            title: "Meeting",
            color: RED,
        },
        {
            startDate: "2022-09-19T12:00",
            endDate: "2022-09-19T13:30",
            title: "Go to gym (Tentative)",
            color: YELLOW,
        },
        // Tue
        {
            startDate: "2022-09-20T11:00",
            endDate: "2022-09-20T12:30",
            title: "Meet Amy (Tentative)",
            color: YELLOW,
        },
        // Wed
        {
            startDate: "2022-09-21T12:30",
            endDate: "2022-09-21T14:00",
            title: "Conference",
            color: ORANGE,
        },
        // Thurs
        {
            startDate: "2022-09-22T09:00",
            endDate: "2022-09-22T10:30",
            title: "Meeting",
            color: RED,
        },
    ],
    // 5
    [
        // Mon
        {
            startDate: "2022-09-19T12:30",
            endDate: "2022-09-19T14:00",
            title: "Meeting",
            color: RED,
        },
        // Tue
        {
            startDate: "2022-09-20T11:00",
            endDate: "2022-09-20T12:30",
            title: "Meet Tom (Tentative)",
            color: YELLOW,
        },
        {
            startDate: "2022-09-20T13:00",
            endDate: "2022-09-20T14:30",
            title: "Meet Amy (Tentative)",
            color: YELLOW,
        },
        // Wed
        {
            startDate: "2022-09-21T11:30",
            endDate: "2022-09-21T13:00",
            title: "Conference",
            color: ORANGE,
        },
        // Thurs
        {
            startDate: "2022-09-22T10:00",
            endDate: "2022-09-22T11:30",
            title: "Meeting",
            color: ORANGE,
        },
    ],
    // 6
    [
        // Mon
        {
            startDate: "2022-09-19T15:30",
            endDate: "2022-09-19T17:00",
            title: "Meeting",
            color: RED,
        },
        // Tue
        {
            startDate: "2022-09-20T16:00",
            endDate: "2022-09-20T17:30",
            title: "Meet Tom (Tentative)",
            color: YELLOW,
        },
        // Wed
        {
            startDate: "2022-09-21T17:00",
            endDate: "2022-09-21T18:30",
            title: "Conference",
            color: ORANGE,
        },
        {
            startDate: "2022-09-20T19:00",
            endDate: "2022-09-20T20:30",
            title: "Meet Amy (Tentative)",
            color: YELLOW,
        },
        // Thurs
        {
            startDate: "2022-09-22T15:00",
            endDate: "2022-09-22T16:30",
            title: "Meeting",
            color: ORANGE,
        },
    ],
    // 7
    [
        // Mon
        {
            startDate: "2022-09-19T16:30",
            endDate: "2022-09-19T18:00",
            title: "Meeting",
            color: RED,
        },
        // Tue
        {
            startDate: "2022-09-20T15:00",
            endDate: "2022-09-20T16:30",
            title: "Meet Tom (Tentative)",
            color: YELLOW,
        },
        // Wed
        {
            startDate: "2022-09-21T15:30",
            endDate: "2022-09-21T17:00",
            title: "Conference",
            color: ORANGE,
        },
        {
            startDate: "2022-09-20T19:00",
            endDate: "2022-09-20T20:30",
            title: "Meet Amy (Tentative)",
            color: RED,
        },
        // Thurs
        {
            startDate: "2022-09-22T17:00",
            endDate: "2022-09-22T18:30",
            title: "Meeting",
            color: ORANGE,
        },
    ],
];
