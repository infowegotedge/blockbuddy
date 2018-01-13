var request = require("request");

var options = { method: 'POST',
  url: 'https://secure.payza.com/ipn2.ashx',
  headers: 
   {
     'cache-control': 'no-cache',
     'content-type': 'application/json' },
  formData: { token: 'T-A6BAF-C63CB-8B789' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
