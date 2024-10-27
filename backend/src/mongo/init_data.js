const { USER_ADMIN_ID, 
        USER_ADMIN_USERNAME, 
        USER_ADMIN_PASSWORD, 
        USER_ADMIN_EMAIL } = process.env

export const init_admin = {"_id": USER_ADMIN_ID, "current": {"username": USER_ADMIN_USERNAME, "password": USER_ADMIN_PASSWORD, "displayName": USER_ADMIN_USERNAME, "email": USER_ADMIN_EMAIL, "tel": "0000000000", "idCard": "0000000000000", "roles": [1]}}
export const init_node  = {"current": {"ownerId": USER_ADMIN_ID , "level": 0, "number": 1, "status": 0 }}