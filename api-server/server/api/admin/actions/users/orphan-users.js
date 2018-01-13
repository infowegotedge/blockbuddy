'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class OrphanUsersList extends ApiBaseActions {

  /**
   * 
   * @param {Request} request 
   * @param {Reply} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /**
   * 
   * @param {Number} code 
   * @param {Object} data 
   */
  out(code, data) {
    return super.response(code, data);
  }

  /**
   * Process Request
   */
  processRequest() {
    let Orphan  = this.app.orphanuser;
    let Users   = this.app.users;
    let query   = this.req.query;
    let curPage = (query.page ? query.page : 1);
    let perPage = (process.env.PAGINATION_LIMIT * 1);
    let filter  = null;
    let _s      = this;

    if(query.filter) {
      filter = query.filter;
    }

    Orphan.getOrphanUsers(filter, (curPage * 1), (perPage * 1), (e, u) => {
      if(!e) {
        let userId = [];
        let length = u.users.length;
        for(let b = 0; b < length; b++) {
          if(u.users[b].sponsor) {
            userId.push(u.users[b].sponsor);
          }
        }

        if(userId.length > 0) {
          Users.getUsersByIds(userId, (_e, _u) => {
            if(!_e) {
              let orphans = [];
              for(let b = 0; b < length; b++) {
                if(u.users[b].sponsor) {
                  let sponsor = _s.filterById(_u, u.users[b].sponsor);
                  orphans.push({
                    "name": u.users[b].name,
                    "email": u.users[b].email,
                    "displayName": u.users[b].displayName,
                    "first_name": u.users[b].first_name,
                    "last_name": u.users[b].last_name,
                    "hashedPassword": u.users[b].hashedPassword,
                    "mobile": u.users[b].mobile,
                    "username": u.users[b].username,
                    "sponsor": (sponsor && sponsor[0] ? sponsor[0].username : ''),
                    "userProfileId": u.users[b].userProfileId,
                    "is_found": u.users[b].is_found
                  });
                }
                else {
                  orphans.push(u.users[b]);
                }
              }

              return _s.out(200, {"hasError": false, "users": orphans, "totalRows": u.count, "currentPage": (curPage * 1), "perPage": perPage});
            }
            else {
              return _s.out(200, {"hasError": false, "users": u.users, "totalRows": u.count, "currentPage": (curPage * 1), "perPage": perPage});
            }

          })
        }
        else {
          return _s.out(200, {"hasError": false, "users": u.users, "totalRows": u.count, "currentPage": (curPage * 1), "perPage": perPage});
        }
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Users not found."})
      }
    })
  }
}

module.exports = (request, reply) => {
  let usersList = new OrphanUsersList(request, reply);
  return usersList.processRequest();
}