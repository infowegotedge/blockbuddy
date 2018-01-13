'use strict';

const handler404 = function (request, reply) {

  reply({"hasError": true, "message": "Invalid API Route"}).code(404);
}

// If No Routes Found This Will Run
module.exports = [
  {
    method: '*',
    path: '/{p*}',
    handler: handler404
  }
]
