# To run server:
1. make sure your current directory is at ./server
2. run `npm install`, `npm start` 


# To convert .ts into .js:
1. run `npx tsc`
2. modify the import line in server.js to `import SQLiteContainer from './sqlite.js';`


# To add a list of donors into database
Use api endpoint POST `/lists`. For parameter, pass in a json file as below:
```json
{
    "listId": "list1",
    "donorData": {
        "headers": [
            "pmm", "smm", "vmm", "exclude", "deceased", "first_name", "nick_name", "last_name", 
            "organization_name", "total_donations", "total_pledge", "largest_gift", "largest_gift_appeal", 
            "first_gift_date", "last_gift_date", "last_gift_amount", "last_gift_request", "last_gift_appeal", 
            "address_line1", "address_line2", "city", "contact_phone_type", "phone_restrictions", 
            "email_restrictions", "communication_restrictions", "subscription_events_in_person", 
            "subscription_events_magazine", "communication_preference", "cancer_type"
        ],
        "data": [
      [
            "Parvati Patel",
            "Bob Brown",
            "Olga Smirnov",
            "no",
            "no",
            "Mei",
            "Sunshine",
            "Lee",
            "",
            0,
            892678,
            0,
            "Appeal2",
            0,
            0,
            0,
            1710791784,
            "Appeal3",
            "707 Redwood Terrace",
            "Apt 444",
            "North Vancouver",
            "Home",
            "Do Not Call",
            "No Surveys",
            "",
            "Opt-out",
            "Opt-in",
            "Event",
            "Ovarian Cancer"
        ],
        [
            "Maria González",
            "Carlos Hernández",
            "Hassan Ahmed",
            "no",
            "no",
            "Bob",
            "",
            "Brown",
            "",
            722191,
            559345,
            526357,
            "Appeal1",
            1610007275,
            1606237245,
            71349,
            1713234877,
            "Appeal1",
            "909 Fir Street",
            "",
            "Kamloops",
            "Work",
            "Do Not Call",
            "No Mass Communications",
            "No Surveys",
            "Opt-out",
            "Opt-in",
            "Magazine",
            "Pancreatic Cancer"
        ],
        [
            "Maria González",
            "Carlos Hernández",
            "Hassan Ahmed",
            "no",
            "no",
            "Jane",
            "",
            "Nguyen",
            "",
            0,
            8005,
            0,
            "Appeal3",
            0,
            0,
            0,
            1704304356,
            "Appeal1",
            "555 Hickory Drive",
            "Unit 777",
            "Salmon Arm",
            "Mobile",
            "",
            "No Mass Appeals",
            "No Surveys",
            "Opt-out",
            "Opt-in",
            "Newsletter",
            "Skin Cancer"
        ],
        [
            "Hiroshi Nakamura",
            "Bob Brown",
            "Olga Smirnov",
            "no",
            "no",
            "Olga",
            "Love",
            "Smith",
            "",
            512035,
            94936,
            382574,
            "Appeal3",
            1621216646,
            1030321866,
            104615,
            1714845304,
            "Appeal3",
            "898 Willowwood Road",
            "Unit 111",
            "Coquitlam",
            "Home",
            "Do Not Call",
            "Do Not Email",
            "No Mass Appeals",
            "Opt-out",
            "Opt-in",
            "Inspiration event",
            "Lung Cancer"
        ]
        ]
    }
}
```