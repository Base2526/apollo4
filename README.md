Frontend
  - react js

Backend
  - Appollo version 4
    - check connect, disconnect client 
    - ระบบ member


# mlm
docker-compose -f docker-compose.ui.yml build
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.prod.yml build

docker-compose -f docker-compose.prod.yml down &&  docker-compose -f docker-compose.prod.yml build &&  docker-compose -f docker-compose.prod.yml up -d

mongoimport --uri mongodb://root:xxxx@mongo:29101/xxx --collection role --file role

mongoimport --db dbName --collection collectionName --file fileName.json

mongoimport --uri 127.0.0.1:27099 --db xxxxx --collection role --file role
mongoimport --host "127.0.0.1" --port "27099" --db xxxxx --collection bank --file bank

mongoimport --host "hostname" --port "port" --db "databasename" --collection "collectionName" --file "filePath"

mongoimport --host "127.0.0.1" --port "29101" --db xxxxx --collection role --file role

<!--  
mongoimport --port "29102" --username xxxx --password xxxx --db xxxxx --collection bank --file bank 
-->

การ manage user role
1. เราต้อง edit mongod.conf
    security:
        authorization: "enabled"
    
    จะมี file ตัวอย่าง
    mouth 
    - ./mongod.conf:/etc/mongod.conf

2. docker exec -it xxxx bash
3. mongosh {mongosh --port xxxx }เข้าไปเพื่อสร้าง user admin 
   3.1  use admin
   3.2  db.createUser({
            user: "",
            pwd: "",
            roles: [ { role: 'root', db: 'xxxx' } ]
        });

         <!-- db.createUser({
            user: "",
            pwd: "",
            roles: [ { role: 'readWrite', db: 'xxxxx' } ]
        }); 
        
        db.createUser({
            user: "",
            pwd: "",
            roles: [ { role: 'readWrite', db: 'xxxxx' } ]
        });
        -->

4. exit แล้วเรา mongosh -u xxxx -p yyyy เพือ login auth
       <!-- db.createUser({
            user: "",
            pwd: "",
            roles: [ { role: 'readWrite', db: 'bl' } ]
        }); -->

        basic command
        - use xxx 
        - db.getUsers()

5. run mongo mode auth set docker-compose  >>> command: mongod >>> --auth <<< --port 29101

Backup
https://davejansen.com/how-to-dump-restore-a-mongodb-database-from-a-docker-container/

docker exec -i a67d48abfccf /usr/bin/mongodump --username xxxx --password xxxx --authenticationDatabase admin --db bl --port 29101 --out /dump
docker exec -i mongo /usr/bin/mongodump --username xxxx --password xxxx --db bl --port 29101 --out /dump


CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true

MONGO_VERSION=6.0.1
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
MONGO_INITDB_DATABASE=
MONGO_INITDB_USERNAME=
MONGO_INITDB_PASSWORD=
MONGO_PORT=27017

# Google Login
REACT_APP_GOOGLE_CLIENT_ID=

# Facebook app id
REACT_APP_FACEBOOK_APPID=

# HOST_GRAPHAL
# REACT_APP_HOST_GRAPHAL=

#   - ELASTIC_URL=http://elasticsearch:9200
#   - ELASTIC_USERNAME=
#   - ELASTIC_PASSWORD=
#   - ELASTIC_INDEX=

# frontend
REACT_APP_NODE_ENV=development
REACT_APP_HOST_GRAPHAL=localhost:4001
FRONTEND_PORT=3000

# graphql
RA_HOST=http://localhost:4001/
GRAPHQL_PORT=4001
JWT_SECRET=

# github
GITHUB_URL_OAUTH_ACCESS_TOKEN=https://github.com/login/oauth/access_token
GITHUB_URL_OAUTH_USER=https://api.github.com/user
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET= 

# google analytics 4
REACT_APP_GOOGLE_ANALYTICS4=

Login with LINE
https://por-porkaew15.medium.com/implement-line-login-with-angular-project-e2e598d3c618


db.getCollection("supplier").find({})

db.getCollection("supplier").aggregate([
        { 
            $match: { 
//                "type": 1,
//                "category": 3,
                "$and" : [
                    {
                        "buys":{
                           $not:{
                               $elemMatch : {itemId: 6}  
                           } 
                        }
                    },
                    {
                        "buys":{
                           $not:{
                               $elemMatch : {itemId: 6}  
                           } 
                        }
                    }
                ]
            }
        }
])

