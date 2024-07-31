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
