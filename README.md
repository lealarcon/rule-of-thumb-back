
# RuleOfThumbBack

This project was created with  [Express](https://expressjs.com/) , [Docker MongoDB](https://hub.docker.com/r/bitnami/mongodb)  and [Pusher](https://pusher.com/).

This is the back-end side from the [principal app](https://github.com/lealarcon/rule-of-thumb-back ).  which only has two endpoints:
  - *GET /api/votes*   Loads all votes from database which includes information of each person
  - *POST /api/votes/:id* Increment by one each vote from the person , post data must be following the structure `{voteId: string, voteType: "positive"|"negative"}`. Each time a vote is inserted into the database, a notification is published using pusher, the front-end is subscribed into each voteId waiting for any change on the database, this is how real time reporting is implemented in this project.

The back-end loads data from a mongo database using docker. First, Install docker in your machine following the tutorial in https://www.docker.com/  , if you are using a linux distribution, make sure to install docker-compose.

## Run database locally 

Inside this repo, the file `docker-compose-db.yml` contains the configuration to run the mongoDB image created by bitnami. 
Just type in your terminal `docker-compose -f docker-compose-db.yml up -d` and make sure the container is running by typing `docker ps -a`  
 ```
CONTAINER ID   IMAGE                                 COMMAND                  CREATED             STATUS                   PORTS                      NAMES
5529993a5667   bitnami/mongodb:4.2.19                "/opt/bitnami/script…"   15 seconds ago      Up 13 seconds            0.0.0.0:27017->27017/tcp   mongodb
```

## Run database locally (first time)
If it is your first time running the database, you will probably find nothing, let's access into the mongodb container by typing
`docker exec -it mongodb /bin/bash` and you will se something like:

```
PS C:\Users\leala> docker exec -it mongodb /bin/bash
I have no name!@5529993a5667:/$
```
Access to mongodb by typing `mongo -u admin -p zemoga rule-of-thumb`
```
I have no name!@5529993a5667:/$ mongo -u admin -p zemoga rule-of-thumb
MongoDB shell version v4.2.19
connecting to: mongodb://127.0.0.1:27017/rule-of-thumb?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("c85a79e5-ec5b-4674-b8d1-8b9aa2922f5a") }
MongoDB server version: 4.2.19
>
```

and run the follwing command to create the `vote` collection and data from the `data.json`

```
db.createCollection('votes');
db.votes.insertMany([
        {
            "name": "Kanye West",
            "description": "Born in Atlanta and raised in Chicago, West was first known as a producer for Roc-A-Fella Records in the early 2000s, producing singles for several mainstream artists.",
            "category": "entertainment",
            "picture": "kanye.png",
            "lastUpdated": "2020-03-10T23:08:57.892Z",
            "votes": {
                "positive": 23,
                "negative": 36
            }
        },
        {
            "name": "Mark Zuckerberg",
            "description": "Born in White Plains, New York, Zuckerberg attended Harvard University, where he launched the Facebook social networking service from his dormitory room on February 4, 2004.",
            "category": "business",
            "picture": "mark.png",
            "lastUpdated": "2021-02-14T23:10:19.134Z",
            "votes": {
                "positive": 418,
                "negative": 324
            }
        },
        {
            "name": "Cristina Fernández de Kirchner",
            "description": "Her first term of office started with a conflict with the agricultural sector, and her proposed taxation system was rejected.",
            "category": "politics",
            "picture": "cristina.png",
            "lastUpdated": "2020-12-10T23:41:07.120Z",
            "votes": {
                "positive": 45,
                "negative": 97
            }
        },
        {
            "name": "Malala Yousafzai",
            "description": "The daughter of educational activist Ziauddin, Yousafzai was born to a Pashtun family in Mingora, Khyber Pakhtunkhwa, Pakistan. Her family came to run a chain of schools in the region.",
            "category": "politics",
            "picture": "malala.png",
            "lastUpdated": "2020-12-10T23:41:07.120Z",
            "votes": {
                "positive": 18,
                "negative": 3
            }
        },
        {
            "name": "Elon Musk",
            "description": "In 2002, Musk founded SpaceX, an aerospace manufacturer and space transport services company, of which he is CEO, CTO, and lead designer.",
            "category": "business",
            "picture": "elon.png",
            "lastUpdated": "2020-12-20T23:43:38.041Z",
            "votes": {
                "positive": 1237,
                "negative": 894
            }
        },
        {
            "name": "Greta Thumberg",
            "description": "Thunberg's activism started after convincing her parents to adopt several lifestyle choices to reduce their own carbon footprint.",
            "category": "environment",
            "picture": "greta.png",
            "lastUpdated": "2021-02-26T23:44:50.326Z",
            "votes": {
                "positive": 118,
                "negative": 45
            }
        }
    ]);
	
```

Data will be persisted by volumes, so if  a container is restarted by any reason, data will keep saved.
## Run API Locally
Once mongodb is running, type `npm start` to run the API,  access to your browser in http://localhost:5000/api/votes to get data from the *vote* collection created previusly.

At this point you can run at the same time the repo https://github.com/lealarcon/rule-of-thumb-front to interact with local data.


## Let's run it easier .... use docker!!!

This app has been dockerized previously and loaded into an instance in GCP  (34.134.128.10) running the same container of mongodb and data persisted in a volume of the VM in GCP. If you run the font-end with docker, you will get production data

Inside this repo you will find the Dockerfile to build the app in production environment.  if you want to re build the image you can run the `build-docker-windows.bat` file. 