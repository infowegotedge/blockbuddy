'use strict';

require('dotenv').config();
const neo4j   = require('neo4j-driver').v1;
const Queries = require('./query.config');
let moment    = require('moment');

/**
 * Neo4J DB Class
 */
class Neo4JDB {

  constructor() {
    let protocol  = (process.env.NEO4J_PROTOCOL || 'bolt');
    let urlString = protocol+'://'+process.env.NEO4J_HOST;
    let driver    = neo4j.driver(urlString, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS));

    this.Db = driver.session();
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  createOne(newValue, cb) {
    var _query  = Queries.createOne,
        _joinAt = (new Date()).toISOString();
        _query  = _query.replace("{userId}", newValue['sponsorid']);
        _query  = _query.replace("{userName}", newValue['name']);
        _query  = _query.replace("{userSponsor}", newValue['sponsor']);
        _query  = _query.replace("{joinAt}", _joinAt);
        _query  = _query.replace("{ip}", newValue['ip']);
        _query  = _query.replace("{email}", newValue['email']);
        _query  = _query.replace("{country}", newValue['country']);
        _query  = _query.replace("{USER_NAME}", newValue['username'])

    // var query  = Queries.createUniLevelOne;
    //     query  = query.replace("{userId}", newValue['sponsorid']);
    //     query  = query.replace("{userName}", newValue['name']);
    //     query  = query.replace("{userSponsor}", newValue['sponsor']);
    //     query  = query.replace("{joinAt}", _joinAt);
    //     query  = query.replace("{ip}", newValue['ip']);
    //     query  = query.replace("{email}", newValue['email']);
    //     query  = query.replace("{country}", newValue['country']);
    //     query  = query.replace("{USER_NAME}", newValue['username'])

    // // Update Uni Level Tree Once In A Life Cycle
    // this.Db.run(query).then((re) => {
    //   let result = re.records[0];

    //   if (!result) {
    //     return cb(true, 'No result found');
    //   }
    //   else {
        
        // Update Binary Tree Once In A Life Cycle
        this.Db.run(_query).then((re) => {
          let result = re.records[0];
    
          if (!result) {
            return cb(true, 'No result found');
          }
          else {
            return cb(false, result);
          }
        })
        .catch((error) => {
          return cb(true, error);
        });

    //   }
    // })
    // .catch((error) => {
    //   return cb(true, error);
    // });
  }

  /**
   * 
   * @param {String} position
   * @param {Object} value
   * @param {String} sponsorId
   * @param {callback} cb 
   */
  leftrightNode(position, value, sponsorId, cb) {
    let that   = this,
        query  = Queries.createLeg,
        joinAt = (new Date()).toISOString();
    query = query.replace("REFID", sponsorId);
    query = query.replace("JOINAT", joinAt),
    query = query.replace("{userId}", value['userid']),
    query = query.replace("{userName}", value['name']),
    query = query.replace("{actualSponsorId}", value['sponsorid']),
    query = query.replace("{sponsorId}", sponsorId),
    query = query.replace("{userSponsor}", value['sponsor']),
    query = query.replace("{joinAt}", joinAt),
    query = query.replace("{ip}", value['ip']),
    query = query.replace("{email}", value['email']),
    query = query.replace("{country}", value['country']);
    query = query.replace("{position}", value['position']);
    query = query.replace("{USER_NAME}", value['username']);

    let query1 = Queries.matchCreate.replace("QUERY_ID", sponsorId);
    // let query1 = Queries.findExtreamLeftOrRight.replace("REFID", sponsorId);
    //     query1 = query1.replace("POSITION", position);
        
    that.Db.run(query1).then((re) => {
      var len = (re.records ? re.records.length : 0);

      if(len === 2) {
        let record  = re.records[0].get('n');
        let record1 = re.records[1].get('n');

        if(position === 'R' && record['properties']['position'] === 'R') {
          return that.leftrightNode('R', value, record['properties']['id'], cb);
        }
        else if(position === 'R' && record1['properties']['position'] === 'R') {
          return that.leftrightNode('R', value, record1['properties']['id'], cb);
        }
        else if (position === 'L' && record['properties']['position'] === 'L') {
          return that.leftrightNode('L', value, record['properties']['id'], cb);
        }
        else if(position === 'L' && record1['properties']['position'] === 'L') {
          return that.leftrightNode('L', value, record1['properties']['id'], cb);
        }
      }
      else if(len === 1) {
        let record = re.records[0].get('n');

        if(position === 'R' && record['properties']['position'] === 'R') {
          return that.leftrightNode('R', value, record['properties']['id'], cb);
        }
        else if (position === 'L' && record['properties']['position'] === 'L') {
          return that.leftrightNode('L', value, record['properties']['id'], cb);
        }
        else {
          that.Db.run(query).then((re) => {
            let result = re.records[0];
            if (!result) {
              return cb(true, 'No result found');
            } else {
              return cb(false, result);
            }
          })
          .catch((error) => {
            return cb(true, error);
          });
        }
      }
      else {
        that.Db.run(query).then((re) => {
          let result = re.records[0];

          if (!result) {
            return cb(true, 'No result found');
          } else {
            return cb(false, result);
          }
        })
        .catch((error) => {
          return cb(true, error);
        });
      }
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  // /**
  // * 
  // * @param {String} position
  // * @param {Object} value
  // * @param {String} sponsorId
  // * @param {callback} cb 
  // */
  // uniLevelTree(position, value, sponsorId, cb) {
  //   let that   = this,
  //       query  = Queries.createUniLevelLeg,
  //       joinAt = (new Date()).toISOString();
  //   query = query.replace("REFID", sponsorId);
  //   query = query.replace("JOINAT", joinAt),
  //   query = query.replace("{userId}", value['userid']),
  //   query = query.replace("{userName}", value['name']),
  //   query = query.replace("{actualSponsorId}", value['sponsorid']),
  //   query = query.replace("{sponsorId}", sponsorId),
  //   query = query.replace("{userSponsor}", value['sponsor']),
  //   query = query.replace("{joinAt}", joinAt),
  //   query = query.replace("{ip}", value['ip']),
  //   query = query.replace("{email}", value['email']),
  //   query = query.replace("{country}", value['country']);
  //   query = query.replace("{position}", value['position']);
  //   query = query.replace("{USER_NAME}", value['username']);

  //   let query1 = Queries.matchUniLevelCreate.replace("QUERY_ID", sponsorId);
  //   that.Db.run(query1).then((re) => {
  //     var len = (re.records ? re.records.length : 0);

  //       that.Db.run(query).then((re) => {
  //         let result = re.records[0];

  //         if (!result) {
  //           return cb(true, 'No result found');
  //         } else {
  //           return cb(false, result);
  //         }
  //       })
  //       .catch((error) => {
  //         return cb(true, error);
  //       });

  //   })
  //   .catch((error) => {
  //     return cb(true, error);
  //   });
  // }

  /**
   * 
   * @param {Object} newValue
   * @param {callback} cb 
   */
  create(newValue, cb) {
    // let that = this;
    // return that.uniLevelTree(newValue['position'], newValue, newValue['sponsorid'], (e, ui) => {
    //   if(!e) {
        return this.leftrightNode(newValue['position'], newValue, newValue['sponsorid'], cb);
    //   }
    //   else {
    //     return cb(true, ui);
    //   }
    // });
  }

  /**
   * 
   * @param {Number} skip
   * @param {Number} limit
   * @param {callback} cb 
   */
  findMembers(skip, limit, cb) {
    let query = Queries.members;
        query = query.replace("{skip}", skip).replace("{limit}", limit); 
    
    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {callback} cb 
   */
  findHpos(cb) {
    let query = Queries.hpos;
    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {Number} hpos
   * @param {Number} skip
   * @param {Number} limit
   * @param {callback} cb 
   */
  findHposMembers(hpos, skip, limit, cb) {
    let query = Queries.hposMember;
        query = query.replace("{skip}", skip).replace("{limit}", limit); 
        query = query.replace("{hpos}", hpos);

    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {Number} number
   * @param {callback} cb 
   */
  findTeamMembers(member, cb) {
    let query = Queries.teamMembers;
        query = query.replace("REFID", member.id).replace("{skip}", member.skip).replace("{limit}", member.limit); 
    
    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {String} memberId
   * @param {callback} cb 
   */
  findTeamMemberCount(memberId, cb) {
    let query = Queries.teamMembersCount;
        query = query.replace("REFID", memberId); 
    
    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {String} memberId
   * @param {callback} cb 
   */
  findMember(memberId, cb) {
    let query = Queries.findMember;
        query = query.replace("REFID", memberId);

    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {String} memberId
   * @param {Number} position
   * @param {callback} cb 
   */
  findReverseTeamMember(memberId, position, cb) {
    let that   = this; 
    let query  = Queries.reverseTeam;
        query  = query.replace("REFID", memberId);
        query  = query.replace(/{position}/g, position);

    that.findMember(memberId, (e, m) => {
      if(e) {
        return cb(true, 'Member not found');
      }

      let records = m.records[0].get('hs');
      query = query.replace("{joinat}", records['properties'].joinat);

      return this.Db.run(query).then((result) => {
        return cb(false, result);
      })
      .catch((error) => {
        return cb(true, error);
      });
    });
  }

  /**
   * 
   * @param {String} memberId
   * @param {Number} pv
   * @param {callback} cb 
   */
  updatePV(memberId, pv, cb) {
    let that  = this;
    let query = Queries.pvaddition;
    let pv1   = 0;
    let rpv1  = 0, rpv = 0;

    that.findMember(memberId, (e, m) => {
      if(e) {
        return cb(true, 'Member not found');
      }

      let records = m.records[0].get('hs');
      pv1  = records['properties'].pv;
      rpv1 = records['properties'].repurchase_pv;

      if(pv1 !== 0) {
        rpv = pv + rpv1;
      }

      pv    = pv1; // pv + pv1;
      query = query.replace("REFID", memberId);
      query = query.replace("PV", pv1);
      query = query.replace("{PV_VALUE}", pv);
      query = query.replace("{RPV}", rpv);

      return this.Db.run(query).then((result) => {
        return cb(false, result);
      })
      .catch((error) => {
        return cb(true, error);
      });
    })
  }

  /**
   * 
   * @param {String} memberId
   * @param {Number} position
   * @param {callback} cb 
   */
  leftrightMember(position, memberId, cb) {
    let query = Queries.leftrightMember;
        query = query.replace("{position}", position);
        query = query.replace("REFID", memberId);
    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {String} memberId
   * @param {callback} cb 
   */
  sumOfPV(memberId, cb) {
    let query = Queries.sumOfPV;
        query = query.replace("REFID", memberId);
    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {String} memberId
   * @param {callback} cb 
   */
  sumOfRPV(memberId, cb) {
    let that   = this;
    let query  = Queries.sumOfRPV;
    let query1 = Queries.ownRpv;

    query  = query.replace("REFID", memberId);
    query1 = query1.replace("REFID", memberId);

    return this.Db.run(query).then((c) => {
      return this.Db.run(query1).then((c1) => {
        let record  = c.records[0].get('sumofrpv');
        let count   = c.records[0].get('count') + 1;
        let record1 = c1.records[0].get('hs.repurchase_pv');

        return cb(false, [{
          'sumofrpv': record + (c1.records.length > 0 ? record1 : 0),
          'count': count
        }]);
      })
      .catch((error) => {
        return cb(true, error);
      });
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {String} memberId
   * @param {callback} cb 
   */
  ownRPV(memberId, cb) {
    let query = Queries.ownRpv;
        query = query.replace("REFID", memberId);
    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {String} memberId
   * @param {callback} cb 
   */
  updateRPV(memberId, cb) {
    let query = Queries.updateRPV;
        query = query.replace("REFID", memberId);
    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {String} memberId
   * @param {callback} cb 
   */
  userCount(memberId, cb) {
    let query = Queries.userCount;
        query = query.replace("REFID", memberId);

    let query1 = Queries.userCountLast14Days;
        query1 = query.replace("REFID", memberId);
        query1 = query.replace("JOIN_14_DAYS", moment().subtract(14, 'days').toISOString());
        query1 = query.replace("JOIN_7_DAYS", moment().subtract(7, 'days').toISOString());

    let query2 = Queries.userCountLast7Days;
        query2 = query.replace("REFID", memberId);
        query2 = query.replace("JOIN_7_DAYS", moment().subtract(7, 'days').toISOString());

    let that = this;

    return this.Db.run(query).then((result) => {

      return that.Db.run(query1).then((result1) => {

        return that.Db.run(query1).then((result2) => {

          return cb(false, {"r": result, "r1": result1, "r3": result2});

        });

      });

    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {String} memberId
   * @param {Number} pageOffset
   * @param {callback} cb 
   */
  totalMyUsers(memberId, pageOffset, cb) {
    let query = Queries.totalMyUsers;
        query = query.replace("REFID", memberId);
        query = query.replace("SKIP_COUNT", pageOffset);
        query = query.replace("LIMIT_NUMBER", parseInt(process.env.PAGINATION_LIMIT));
    
    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {String} memberId
   * @param {String} userId
   * @param {callback} cb 
   */
  myTeam(userId, memberId, isAdmin, cb) {
    let query1 = Queries.validateMyTeam;
        query1 = query1.replace("REFID", userId);
        query1 = query1.replace("MEMBER_ID", memberId);

    let query = Queries.myNetworks;
        query = query.replace("REFID", memberId);
    
    if((userId + '') === (memberId + '')) {
      return this.Db.run(query).then((result) => {
        return cb(false, result);
      })
      .catch((error) => {
        return cb(true, error);
      });
    }
    else {
      if(isAdmin === 'admin') {
        return this.Db.run(query).then((result) => {
          return cb(false, result);
        })
        .catch((error) => {
          return cb(true, error);
        });
      }
      else {
        return this.Db.run(query1).then((res) => {
          let record = res.records[0];
          if(record.length === 0) {
            return cb(true, 'No Data Found');
          }
          else {
            return this.Db.run(query).then((result) => {
              return cb(false, result);
            })
            .catch((error) => {
              return cb(true, error);
            });
          }
        })
        .catch((error) => {
          return cb(true, error);
        });
      }
    }
  }

  // /**
  //  * 
  //  * @param {String} memberId
  //  * @param {String} userId
  //  * @param {callback} cb 
  //  */
  // myUniLevelTeam(userId, memberId, isAdmin, cb) {
  //   let query1 = Queries.validateUniLevelMyTeam;
  //       query1 = query1.replace("REFID", userId);
  //       query1 = query1.replace("MEMBER_ID", memberId);

  //   let query = Queries.myUniLevelNetworks;
  //       query = query.replace("REFID", memberId);
    
  //   if((userId + '') === (memberId + '')) {
  //     return this.Db.run(query).then((result) => {
  //       return cb(false, result);
  //     })
  //     .catch((error) => {
  //       return cb(true, error);
  //     });
  //   }
  //   else {
  //     if(isAdmin === 'admin') {
  //       return this.Db.run(query).then((result) => {
  //         return cb(false, result);
  //       })
  //       .catch((error) => {
  //         return cb(true, error);
  //       });
  //     }
  //     else {
  //       return this.Db.run(query1).then((res) => {
  //         let record = res.records[0];
  //         if(record.length === 0) {
  //           return cb(true, 'No Data Found');
  //         }
  //         else {
  //           return this.Db.run(query).then((result) => {
  //             return cb(false, result);
  //           })
  //           .catch((error) => {
  //             return cb(true, error);
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         return cb(true, error);
  //       });
  //     }
  //   }
  // }

  myDownline(memberId, pageOffset, cb) {
    let query = Queries.myDownline;
        query = query.replace("REFID", memberId);
        query = query.replace("SKIP_COUNT", pageOffset);
        query = query.replace("LIMIT_NUMBER", parseInt(process.env.PAGINATION_LIMIT));

    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  myDownlineCount(memberIds, cb) {
    let query = Queries.myDonwlineMemberCount;
        query = query.replace("MEMBER_IDS", memberIds);
    
    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  myDonwlineCount(memberId, cb) {
    let query = Queries.myDownlineCount;
        query = query.replace("REFID", memberId);
    
    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {String} memberId
   * @param {callback} cb 
   */
  memberCount(memberIds, cb) {
    let query = Queries.memberCount;
        query = query.replace("MEMBER_LIST", memberIds);
    
    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }

  /**
   * 
   * @param {String} memberIds
   * @param {callback} cb 
   */
  memberUniLevelCount(memberIds, cb) {
    let query = Queries.memberUniLevelCount;
        query = query.replace("MEMBER_LIST", memberIds);
    
    return this.Db.run(query).then((result) => {
      return cb(false, result);
    })
    .catch((error) => {
      return cb(true, error);
    });
  }
}

module.exports = new Neo4JDB();
