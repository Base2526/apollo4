backup db
mongodump --out /data/db/backup --username xxxx --password xxxx --port xxxx --authenticationDatabase xxxx

restore db
mongorestore /data/db/backup --username xxxx --password xxxx --port xxxx --authenticationDatabase xxxx


mongo_backup.sh

# step #1
# --------------------
#!/bin/bash

# Set the date format for the backup directory
DATE=$(date +%Y%m%d_%H%M%S)

# Define backup directory on the host
BACKUP_DIR="/path/to/your/backup/directory/$DATE"

# Create backup directory
mkdir -p $BACKUP_DIR

# Dump the database
docker exec -it mongo mongodump --out /data/db/backup --username root --password example --authenticationDatabase admin

# Copy the backup to the host
docker cp mongo:/data/db/backup $BACKUP_DIR

# Remove the backup from the container
docker exec -it mongo rm -rf /data/db/backup

# Optionally, remove old backups (e.g., keep last 7 days)
find /path/to/your/backup/directory/ -type d -mtime +7 -exec rm -rf {} \;
# --------------------

# step #2
chmod +x mongo_backup.sh

# step #3
0 2 * * * /path/to/your/mongo_backup.sh


<!-- //////////////
{
    "_id" : ObjectId("6694927862cd9e01921e2978"),
    "current" : {
        "avatar" : {
            "url" : "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/698.jpg",
            "filename" : "Trenton",
            "mimetype" : "image/png",
            "encoding" : "7bit"
        },
        "lockAccount" : {
            "lock" : false,
            "date" : ISODate("2024-07-15T03:07:36.416+0000")
        },
        "roles" : [
            NumberInt(1)
        ],
        "isActive" : NumberInt(0),
        "username" : "glen",
        "password" : "U2FsdGVkX1/RtuEDunSjMhBLELqYYuqMCFqrVtOGH3g=",
        "email" : "Mohamed97@yahoo.com",
        "displayName" : "Gerry",
        "lastAccess" : ISODate("2024-07-15T07:34:11.102+0000")
    },
    "history" : [

    ],
    "createdAt" : ISODate("2024-07-15T03:07:36.422+0000"),
    "updatedAt" : ISODate("2024-07-15T07:34:11.105+0000"),
    "__v" : NumberInt(0)
}

 -->



 The error you're encountering indicates that MongoDB was not started with replication enabled, and that the `security.keyFile` is missing when authorization is enabled in a replica set. Here's how you can resolve these issues using `docker-compose`.

### 1. Ensure Replication is Enabled
To enable replication, you need to configure MongoDB with the appropriate settings in your `docker-compose.yml` file. The key setting is `replication.replSetName`.

### 2. Set Up the `keyFile` for Security
When authorization is enabled, MongoDB requires a `keyFile` for internal authentication between replica set members. You need to create a key file and mount it into the container.

### Example `docker-compose.yml` Configuration

```yaml
version: '3.8'

services:
  mongo1:
    image: mongo:6.0
    container_name: mongo1
    hostname: mongo1
    ports:
      - 27017:27017
    volumes:
      - ./data/mongo1:/data/db
      - ./config/mongo-keyfile:/etc/mongo-keyfile
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_REPLICA_SET_NAME: "rs0"
      MONGO_INITDB_DATABASE: admin
    command: >
      mongod --replSet rs0 --keyFile /etc/mongo-keyfile --bind_ip_all
    networks:
      - mongo-cluster

  mongo2:
    image: mongo:6.0
    container_name: mongo2
    hostname: mongo2
    volumes:
      - ./data/mongo2:/data/db
      - ./config/mongo-keyfile:/etc/mongo-keyfile
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    command: >
      mongod --replSet rs0 --keyFile /etc/mongo-keyfile --bind_ip_all
    networks:
      - mongo-cluster

  mongo3:
    image: mongo:6.0
    container_name: mongo3
    hostname: mongo3
    volumes:
      - ./data/mongo3:/data/db
      - ./config/mongo-keyfile:/etc/mongo-keyfile
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    command: >
      mongod --replSet rs0 --keyFile /etc/mongo-keyfile --bind_ip_all
    networks:
      - mongo-cluster

networks:
  mongo-cluster:
    driver: bridge
```

### Steps to Set Up

1. **Create a Key File**:
   - Generate a key file for MongoDB replica set authentication.
   ```bash
   openssl rand -base64 756 > mongo-keyfile
   chmod 600 mongo-keyfile
   ```
   - Place the `mongo-keyfile` in the `./config/` directory (as referenced in the `docker-compose.yml` file).

2. **Start the Containers**:
   - Run the containers with `docker-compose up -d`.

3. **Initiate the Replica Set**:
   - docker exec -it xxxx bash
   - mongosh --username root --password example --port 27017
   
   - Once the containers are up, initiate the replica set.
   ```bash
   docker exec -it mongo1 mongo --eval 'rs.initiate({_id: "rs0", members: [{ _id: 0, host: "mongo1:27017" }, { _id: 1, host: "mongo2:27017" }, { _id: 2, host: "mongo3:27017" }]})'
   ```

   rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})


mongosh --username root --password example
### Notes
- Ensure the `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD` are the same across all instances.
- The `keyFile` should be the same for all members of the replica set and should be securely generated and stored.

This configuration should resolve the errors related to replication and `security.keyFile`.



rs.status()

docker logs mongo-express

mongodb://root:example@mongo1:27017,mongo2:27017,mongo3:27017/?replicaSet=rs0



# Step #1 docker exec -it xxxx bash
# Step #2 mongosh
# Step #3 rs.initiate({_id: "rs0", members: [{ _id: 0, host: "mongo1:27017" }, { _id: 1, host: "mongo2:27017" }, { _id: 2, host: "mongo3:27017" }]})

# Step #4
# ต้อง add user ก่อนด้วย
# use admin
# db.createUser({
#   user: "admin",
#   pwd: "Somkid058848391",
#   roles: [{ role: "root", db: "admin" }]
# })

# db.createUser({
#   user: "insurance",
#   pwd: "Somkid058848391",
#   roles: [{ role: "readWrite", db: "insurance" }]
# })

