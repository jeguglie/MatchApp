# Matcha 42 project
![MatchApp](https://i.imgur.com/R33gl92.png)  
42 Project - MatchApp Dating Web Application  
Node.js - Express - React - PostgreSQL - Semantic UI

## Demo
`You can test the app` [here](https://matcha.jv-g.fr)<br>
You can use three pre-filled profiles `user1@gmail.com` `user2@gmail.com` with password `345102.jJ`<br> 
500 random profiles are generated with Faker.js
- Avatar
- Username
- Lastname
- Geolocation
- Interests
- Likes
- Gender
- Interested
- Age
- Online
- 10000 interests are filled in database

## Generate with Faker
Profiles are already generated in database/dbexport.pgsql
`http://localhost:5000/api/faker` <br> 
(waiting time ~ 1min30, you can view progress in terminal) will generate 1002 faked profiles (include user1 & user2) 

## Install on localhost (dev)
- Install PostgreSQL (command line or by PostgreSQL client)
- Create database named matcha (according to env variable in ecosystem-matcha.config.js) 
  You can use command line or PGAdmin4
- Edit env variable in ecosystem-matcha.config.js
- Do npm install on root folder and /client
- Run server with npm start on root folder and run client server (webpack ) with npm run dev on /client
- Back-end server listen now on 5000, client on 8080

## How to deploy to remote server
- Edit deploy object in ecosystem-matcha.config.js (ssh key, user, host, repo address, path, post-deploy)
- Run pm2 deploy ecosystem-matcha.config.js production
- After deploying, pm2 start automatically server.js

### Features

- Inscription and connexion
- User profile
- User experience
- Research and filter users
- Real time chat
- Real time notification system

### Frameworks / Libraries

- React : https://fr.reactjs.org/
- Node.js : https://nodejs.org/
- Express : http://expressjs.com/
- SemanticUI : http://semantic-ui.com/
- PostgreSQL : https://www.postgresql.org/
- Socket.io : https://socket.io/
- Faker.js : https://github.com/marak/Faker.js/

### Some views
![MatchApp](https://imgur.com/Qtbz5vH.png)<br>  
![MatchApp](https://imgur.com/x60tyXr.png)<br>
![MatchApp](https://imgur.com/wgcnjfa.png)<br> 
![MatchApp](https://imgur.com/awklGCB.png)<br>
![MatchApp](https://imgur.com/YX8mREk.png)<br>
![MatchApp](https://imgur.com/ev8Pg9A.png)<br>
![MatchApp](https://imgur.com/1jYSRCO.png)<br>
![MatchApp](https://imgur.com/Z1muLvi.png)<br>
