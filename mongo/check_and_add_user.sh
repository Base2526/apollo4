#!/bin/bash

set -x

# MongoDB connection details
MONGO_HOST="a4_mongo"
# MONGO_PORT=27017

# script that includes a wait mechanism to ensure MongoDB is ready before executing commands:
# Wait for MongoDB to be ready
until mongosh --host $MONGO_HOST --port $MONGO_PORT --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --eval "print(\"waited for connection\")"; do
  >&2 echo "MongoDB is unavailable - sleeping"
  sleep 1
done

# User details
declare -A USERS=(
    ["$MONGO_INITDB_ADMIN_DATABASE"]="$MONGO_INITDB_ADMIN_USERNAME:$MONGO_INITDB_ADMIN_PASSWORD:$MONGO_INITDB_ADMIN_DATABASE"
    ["$MONGO_INITDB_DATABASE"]="$MONGO_INITDB_USERNAME:$MONGO_INITDB_PASSWORD:$MONGO_INITDB_DATABASE"
)

# Function to check and create user
check_and_create_user() {
    local db="$1"
    local user="$2"
    local password="$3"

    local user_exists=$(mongosh --host "$MONGO_HOST" -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --port "$MONGO_PORT" --quiet --eval "
        const users = db.getSiblingDB('$db').getUsers();
        Array.isArray(users) && users.some(u => u.user === '$user');
    ")

    if [ "$user_exists" == "true" ]; then
        echo "User '$user' already exists in database '$db'."
    else
        echo "User '$user' does not exist in database '$db'. Adding user..."
        mongosh --host "$MONGO_HOST" -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --port "$MONGO_PORT" --quiet --eval "
            db.getSiblingDB('$db').createUser({
                user: '$user',
                pwd: '$password',
                roles: [{ role: 'readWrite', db: '$db' }]
            });
        "
        echo "User '$user' added successfully to database '$db'."
    fi
}

# Loop through the USERS array to check and create users
for db in "${!USERS[@]}"; do
    IFS=":" read -r user password db_name <<< "${USERS[$db]}"
    check_and_create_user "$db_name" "$user" "$password"
done
