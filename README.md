# dice-game-api | Node.js
## This api has below features - 
1. Simple Turn Based Dice Game. 
2. Dice Outcomes range from 1 to 6. 
3. 4 Player game. 
4. Winning Criteria : Total Sum of the dice outcomes for a player reach 61 or greater. 
5. 30 Sec Turn or Auto Play

## MongoDB Index Creation
>### Kindly make sure the MongoDB is running on the same machine where you are going to run the dice-game-api or else update the MongoDB connection string accordingly in the development.json file and then run below queries in MongoDB console to create index :
```
use dice-game
db.games.createIndex( { "_id": 1 } )
db.users.createIndex( { "email": 1 , "mobile":1},   { unique: true})
db.dice_rolling_locks.createIndex( { "game_id": 1, "user_id":1 }, { unique: true, expireAfterSeconds: 5 } )
```
#### Note : Without indexing few functionalities won't work as expected. 


## Getting dice-game-api
```
git clone https://github.com/krdganesh/dice-game-api.git
```

## Change the directory to dice-game-api/src
```
cd dice-game-api/src
```
## Install dependencies
```
npm install
```
## Starting the api
```
npm run start
```

## Starting the api in development mode
```
npm run dev
```

## Postman Collection
```
https://www.getpostman.com/collections/657b6b6f08900fbafc5c
```