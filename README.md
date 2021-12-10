# mykanjilist-backend
<a href="https://mykanjilist-backend.herokuapp.com/api/kanjilist">link to api</a>

Base url: `https://mykanjilist-backend.herokuapp.com`

### User
`POST`
`/api/register`
Creates a new account and gives back login info + bearer tokeen
```JSON
{
    "userName": "Tester",
    "email": "tester@gmail.com",
    "password": "secret123"
}
```

`POST`
`/api/login`
Logs in a user and gives back login info + bearer token
```JSON
{
    "email": "tester@gmail.com",
    "password": "secret123"
}
```

### KanjiList

`POST` 
`/api/kanjilist`
Creates a new kanji list
```JSON
{
"name": "My Kanji List",
"description":"This is my own kanji list (20 character)",
"tags":["JLPT N5", "N5", "easy"],
"kanji": ["価","格","目","録"]
}
```

`GET`
`/api/kanjilist`
Receives all kanji lists on the DB

`GET`
`/api/kanjilist/:id`
Receives a single kanji list based on the ID 

`GET`
`/api/kanjilist/user/:id`
Receives all the kanji lists from a user based on the users ID

`PUT`
`/api/kanjilist/user/:id`
Updates the kanji list with the corresponding ID
```JSON
{
"name": "My Kanji List",
"description":"This is my own kanji list (20 character)",
"tags":["JLPT N5", "N5", "easy"],
"kanji": ["価","格","目","録"]
}
```

`DELETE`
`/api/kanjilist/user/:id`
Deletes the kanji list with the corresponding ID

### Guide

`POST` 
`/api/guide`
Creates a new guide
```JSON
{
    "title": "my new guide",
    "tags": ["new", "test"],
    "content": "Content with 250 characters",
    "kanjilist": "61b0ce6e685ec473aecb2964"
}
```
ALlows reference to kanji list via id

`GET`
`/api/guide`
Receives all guides on the DB

`GET`
`/api/guide/:id`
Receives a single guide based on the ID 

`GET`
`/api/guide/user/:id`
Receives all the guides from a user based on the users ID

`PUT`
`/api/guide/user/:id`
Updates the guide with the corresponding ID
```JSON
{
    "title": "my new guide",
    "tags": ["new", "test"],
    "content": "Content with at least 250 characters",
    "kanjilist": "61b0ce6e685ec473aecb2964"
}
```
ALlows reference to kanji list via id

`DELETE`
`/api/guide/user/:id`
Deletes the guide with the corresponding ID

### Practice Resource

`POST` 
`/api/practiceresource`
Creates a new practice resource
```JSON
{
    "estimatedReadingTime": 10,
    "title": "My Practice Resource",
    "content": "Conteent with at least 50 characters",
    "requiredSkills": ["Reading", "240 kanji", "grade 1"],
    "kanjilist": "61b247d478ed174c34654048"
}
```
ALlows reference to kanji list via id

`GET`
`/api/practiceresource`
Receives all practice resources on the DB

`GET`
`/api/practiceresource/:id`
Receives a single practice resource based on the ID 

`GET`
`/api/practiceresource/user/:id`
Receives all the practice resources from a user based on the users ID

`PUT`
`/api/practiceresource/user/:id`
Updates the practice resource with the corresponding ID
```JSON
{
    "estimatedReadingTime": 10,
    "title": "My Practice Resource",
    "content": "Conteent with at least 50 characters",
    "requiredSkills": ["Reading", "240 kanji", "grade 1"],
    "kanjilist": "61b247d478ed174c34654048"
}
```
ALlows reference to kanji list via id

`DELETE`
`/api/practiceresource/user/:id`
Deletes the practice resource with the corresponding ID


## ERD:
<img src="https://i.imgur.com/4F1YIZS.png">

