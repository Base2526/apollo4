const { USER_ADMIN_ID, 
        USER_ADMIN_USERNAME, 
        USER_ADMIN_PASSWORD, 
        USER_ADMIN_EMAIL } = process.env

export const init_admin = {"_id": USER_ADMIN_ID, "current": {"username": USER_ADMIN_USERNAME, "password": USER_ADMIN_PASSWORD, "displayName": USER_ADMIN_USERNAME, "email": USER_ADMIN_EMAIL, "tel": "0000000000", "idCard": "0000000000000", "roles": [1]}}
export const init_node  = {"current": {"ownerId": USER_ADMIN_ID , "level": 0, "number": 1, "status": 0 }}

// BS, BG, BD, BP, MA, MB, MC, MD, ME, MF, MG, MH, MI, MJ, MK, ML, MM, MN, MO, MP, MQ, MR, MS
export const init_position = [  {"_id":"6721098ce9dccb02aab4cb3e","level":0,"name":"BM","percent":0,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb3f","level":1,"name":"BS","percent":0,"budget":5000 },
                                {"_id":"6721098ce9dccb02aab4cb40","level":2,"name":"BG","percent":0.5,"budget":10000 },
                                {"_id":"6721098ce9dccb02aab4cb41","level":3,"name":"BD","percent":1,"budget":50000 },
                                {"_id":"6721098ce9dccb02aab4cb42","level":4,"name":"BP","percent":2,"budget":200000 },
                                {"_id":"6721098ce9dccb02aab4cb43","level":5,"name":"MA","percent":3,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb44","level":6,"name":"MB","percent":4,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb45","level":7,"name":"MC","percent":5,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb46","level":8,"name":"MD","percent":5.5,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb47","level":9,"name":"ME","percent":6,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb48","level":10,"name":"MF","percent":6.5,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb49","level":11,"name":"MG","percent":7,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb4a","level":12,"name":"MH","percent":7.3,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb4b","level":13,"name":"MI","percent":7.5,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb4c","level":14,"name":"MJ","percent":7.8,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb4d","level":15,"name":"MK","percent":8,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb4e","level":16,"name":"ML","percent":8.3,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb4f","level":17,"name":"MM","percent":8.5,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb50","level":18,"name":"MN","percent":8.8,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb51","level":19,"name":"MO","percent":9,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb52","level":20,"name":"MP","percent":9.3,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb53","level":21,"name":"MQ","percent":9.5,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb54","level":22,"name":"MR","percent":9.8,"budget":0 },
                                {"_id":"6721098ce9dccb02aab4cb55","level":23,"name":"MS","percent":10,"budget":0 }]