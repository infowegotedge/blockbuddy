module.exports = {
  // Create new member in Graph DB
  'matchCreate': 'MATCH (hs:BBApp108 {id: "QUERY_ID"})-[:JOIN_OF]->(n) RETURN n',

  // Create User Query
  'create': 'MATCH (n:BBApp108 {id: "REFID"}) CREATE (n)-[:JOIN_OF {since:"JOINAT", hpos: n.hpos+1}]->(hs:BBApp108 {id: "{userId}", name: "{userName}", sponsor_id: "{sponsorId}", sponsor: "{userSponsor}", position: "{position}", joinat: "{joinAt}", hpos: n.hpos+1, ip: "{ip}", email: "{email}", country: "{country}", username: "{USER_NAME}", pv: 0, repurchase_pv: 0}) RETURN hs,n',

  // Create One User Query
  'createOne': 'CREATE (hs:BBApp108 {id: "{userId}", name: "{userName}", sponsor: "{userSponsor}", joinat: "{joinAt}", hpos: 1, ip: "{ip}", email: "{email}", country: "{country}", username: "{USER_NAME}", pv: 0, repurchase_pv: 0}) RETURN hs',

  // Create User Leg Query
  'createLeg': 'MATCH (n:BBApp108 {id: "REFID"}) CREATE (n)-[:JOIN_OF {since:"JOINAT", hpos: n.hpos+1}]->(hs:BBApp108 {id: "{userId}", name: "{userName}", actual_sponsor_id: "{actualSponsorId}" , sponsor_id: "{sponsorId}", sponsor: "{userSponsor}", position: "{position}", joinat: "{joinAt}", hpos: n.hpos+1, ip: "{ip}", email: "{email}", country: "{country}", username: "{USER_NAME}", pv: 0, repurchase_pv: 0}) RETURN hs,n',

  // Find Team Member Query
  'teamMembers': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*]->(n) RETURN n ORDER BY n.joinat ASC SKIP {skip} LIMIT {limit}',

  // Find Team Member Count Query
  'teamMembersCount': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*]->(n) RETURN COUNT(n) AS totalRows',

  // Find Reverse Team Member Query
  'reverseTeam': 'MATCH (hs:BBApp108 {id: "REFID", position: "{position}"})<-[:JOIN_OF*]->(n) WHERE n.position = "{position}" AND n.joinat < "{joinat}" RETURN n ORDER BY n.joinat ASC',

  // Find Member Query
  'findMember': 'MATCH (hs:BBApp108 {id: "REFID"}) RETURN hs',

  // Find PV Query
  'pvaddition': 'MATCH (hs:BBApp108 {id: "REFID", pv: PV}) SET hs.pv = {PV_VALUE}, hs.repurchase_pv = {RPV} RETURN hs', 

  // Find HPOS Query
  'hpos': 'MATCH (hs:BBApp108) RETURN MAX(hs.hpos) as hpos',

  // Find HPOS Member Query
  'hposMember': 'MATCH (hs:BBApp108) WHERE hs.hpos = {hpos} RETURN hs ORDER BY hs.joinat ASC',

  // Find Member Query
  'members': 'MATCH (hs:BBApp108) RETURN hs ORDER BY hs.joinat ASC SKIP {skip} LIMIT {limit}',

  // Find Left Member Query
  'leftrightMember': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*..1]->(n) RETURN n',

  // Find Right Member Query
  'rightMember': 'MATCH (hs:BBApp108) WHERE hs.hpos = {hpos} RETURN hs ORDER BY hs.joinat ASC SKIP {skip} LIMIT {limit}',

  // Find Sum OF PV Query
  'sumOfPV': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*]->(n) RETURN SUM(n.pv) as sumofpv, COUNT(n) as count',

  // Find Sum OF RPV Query
  'sumOfRPV': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*]->(n) RETURN SUM(n.repurchase_pv) as sumofrpv, COUNT(n) as count',

  // Find Sum OF OWN PV Query
  'ownRpv': 'MATCH (hs:BBApp108) WHERE hs.id = "REFID" RETURN hs.repurchase_pv',

  // Find Update PV Query
  'updateRPV': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*]->(n) SET hs.repurchase_pv = 0, n.repurchase_pv = 0 RETURN hs',

  // Find User Count Query
  'userCount': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*]->(n) RETURN COUNT(n) as count',

  // Find User Count Query Last 14 Days
  'userCountLast14Days': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*]->(n) WHERE n.joinat >= "JOIN_14_DAYS" AND n.joinat < "JOIN_7_DAYS" RETURN COUNT(n) as count',

  // Find User Count Query Last Week
  'userCountLast7Days': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*]->(n) WHERE n.joinat >= "JOIN_7_DAYS" RETURN COUNT(n) as count',

  // Find Total My User Query
  'totalMyUsers': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*]->(n) RETURN n, (n.hpos - hs.hpos) as position ORDER BY n.id ASC SKIP SKIP_COUNT LIMIT LIMIT_NUMBER',

  // Find Validate My Team Query
  'validateMyTeam': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*]->(n) WHERE n.id = "MEMBER_ID" RETURN n;',

  // Find My Networks Query
  'myNetworks': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*..2]->(n) RETURN hs, n',

  // Find Member Count Query
  'memberCount': 'MATCH (hs:BBApp108)-[:JOIN_OF*]->(n) WHERE hs.id IN [MEMBER_LIST] RETURN hs.id as member_id, COUNT(n.id) as member_count, (n.pv + n.repurchase_pv) as totalPurchasePV',

  'myDownline': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*]->(n) RETURN n ORDER BY n.id ASC SKIP SKIP_COUNT LIMIT LIMIT_NUMBER',

  'myDownlineCount': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*]->(n) RETURN count(n) AS total_members',

  'myDonwlineMemberCount': 'MATCH (hs:BBApp108)-[:JOIN_OF*]->(n) WHERE hs.id IN [MEMBER_IDS] RETURN hs.id AS id, COUNT(n) AS total_users',

  // Find Member Count Query
  'memberUniLevelCount': 'MATCH (hs:BBApp108)-[:JOIN_OF*..20]->(n) WHERE hs.id IN [MEMBER_LIST] RETURN hs.id as member_id, COUNT(n.id) as member_count',

  'findExtreamLeftOrRight': 'MATCH (hs:BBApp108 {id: "REFID"})-[:JOIN_OF*]->(n) WHERE n.position = "POSITION" RETURN n ORDER BY n.joinat DESC LIMIT 1'

  // // UniLevel Match Create
  // 'matchUniLevelCreate': 'MATCH (hs:BBApp7 {id: "QUERY_ID"})-[:JOIN_OF]->(n) RETURN n',

  // // Create Uni Level One User Query
  // 'createUniLevelOne': 'CREATE (hs:BBApp7 {id: "{userId}", name: "{userName}", sponsor: "{userSponsor}", joinat: "{joinAt}", hpos: 1, ip: "{ip}", email: "{email}", country: "{country}", username: "{USER_NAME}", pv: 0, repurchase_pv: 0}) RETURN hs',

  // // UniLevel User Leg Query
  // 'createUniLevelLeg': 'MATCH (n:BBApp7 {id: "REFID"}) CREATE (n)-[:JOIN_OF {since:"JOINAT", hpos: n.hpos+1}]->(hs:BBApp7 {id: "{userId}", name: "{userName}", actual_sponsor_id: "{actualSponsorId}" , sponsor_id: "{sponsorId}", sponsor: "{userSponsor}", position: "{position}", joinat: "{joinAt}", hpos: n.hpos+1, ip: "{ip}", email: "{email}", country: "{country}", username: "{USER_NAME}", pv: 0, repurchase_pv: 0}) RETURN hs,n',

  // // Find Uni Level My Networks Query
  // 'myUniLevelNetworks': 'MATCH (hs:BBApp7 {id: "REFID"})-[:JOIN_OF*..1]->(n) RETURN hs, n ORDER BY hs.id ASC, n.id ASC',

  // // Find Uni Level Validate My Team Query
  // 'validateUniLevelMyTeam': 'MATCH (hs:BBApp7 {id: "REFID"})-[:JOIN_OF*]->(n) WHERE n.id = "MEMBER_ID" RETURN n;',

  // // Find My Uni Level Networks Query
  // 'myUniLevelNetworks': 'MATCH (hs:BBApp7 {id: "REFID"})-[:JOIN_OF*..2]->(n) RETURN hs, n',
}