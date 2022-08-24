# TRYBE FUTEBOL CLUBE ⚽

Project developed in the Back-end Module at the [Trybe](https://www.betrybe.com/) course.
The front-end app was provided by Trybe.

### 🎯
The Trybe Futebol Clube is an informative website about football matches and rankings. <br>
The goal was to build an API and integrate — by docker-compose — the apps, so they can work consuming a database. <br>
The API was tested using Sinon, Mocha and Chai. <br>

🛠️ **Tools:**
* [Sequelize](https://sequelize.org/)
* [Express](https://expressjs.com/)
* [Node](https://nodejs.org/en/)
* [JWT](https://jwt.io/)
* [express-async-errors](https://www.npmjs.com/package/express-async-errors)
* [nodemon](https://www.npmjs.com/package/nodemon)
* [Chai](https://www.chaijs.com/)
* [Sinon](https://sinonjs.org/)
* [Mocha](https://mochajs.org/)
<!-- * [Swagger](https://swagger.io/) -->
<br>

---

## ✨**Features**

Feature | Route | Info
------- | ------ |------
Login | POST /login | Uses JWT. { username: user@user.com password: secret_user }
Login info | GET /login/validate | Returns the user type
List teams | GET /teams
Get team by ID | GET /teams/:id
List matches | GET /matches
Create a match | POST /matches | The match will be save as in progress. Login is required.
Finish a match | PATCH /matches/:id/finish
Update in progress macth | PATCH /matches/:id
Shows ranking of home teams | GET /leaderboard/home
Shows ranking of away teams | GET /leaderboard/away
Shows general ranking | GET /leaderboard
<br/>

<!-- ## 📜Documentation
Access the route `/api-docs` to see the documentation.

Ex.: `http://localhost:3000/api-docs`

<br> -->

---

## How to install the application:
Download the code:
```
git clone git@github.com:queite/trybe-futebol-clube.git
```
Enter the root folder:
```
cd trybe-futebol-clube
```
Install dependencies:
```
npm install
```
Run on docker:
```
npm run compose:up
```

Go to the `localhost:3000` to see from the frontend or use the routes on Thunder Client to see the back-end. <br>
Ex.: `localhost:3001/leaderboard`

---

All [Trybe](https://www.betrybe.com/) projects use `linters`, `Git` and `GitHub`.<br/>
