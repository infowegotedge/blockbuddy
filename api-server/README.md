## Prerequisite

- Node  version >= 7.2.0
- NPM   version >= 3.10.9


## Installation

- Extract the bbapp.tar.gz
- cd into bbapp and run `npm install`
- create .env file and paste Environment Variables and replace place holders
- Run `node ./database/seed.js` to create default user, banners and campaigns
- Run `node server.js`


## Tasks

- Neo4J Binary Create Tasks

```
  node ./tasks/binary.task.js
```

- Binary Commission Task

```
  node ./tasks/binary.commission.js
```


## Enviroment Variables

```
SERVER_PORT=8912
SERVER_URL=SERVER_URL_INCLUDING_HTTP_OR_HTTPS
TRADE_API_URL=http://localhost:4567
TRADE_ADMIN_TOKEN=abb3cfcf-f10b-4058-8ffd-3deb864d84c1
TRADE_ADMIN_PASSWORD=acag151Hsg*w3453
APP_VERIFY_EMAIL_URL='http://APP_URL/#/verify-email/EMAIL_LINK_TEXT'
APP_RESET_EMAIL_URL='http://APP_URL/#/reset-password/EMAIL_LINK_TEXT'
APP_REDIRECT='http://APP_URL/#/purchase/'
AUTH_CLIENT_SECRET=<YOUR_AUTH_SECERT>
AUTH_CLIENT_AUDIENCE=<YOUR_CLIENT_SECERT>
AUTH_PASSWORD=<YOUR_AUTH_PASSWORD>
MONGOOSE_DB_PATH=localhost:27017
MONGOOSE_DB=bbapp
VISIBILITY_LIST_TYPES='active,inactive'
WEBSITE_VISIBILITY_TYPE='active,inactive,store,store_active,store_inactive'
PAGINATION_LIMIT=25
ID_PARAM_SIZE_LIMIT=24
DEBUG_TYPE=ALL
ALLOW_DEBUG=1
TOKEN_ALGORITHS='HS512'
AUTH_COOKIE_NAME=_btceth
TOKEN_EXPIRES=3600
TOKEN_EXPIRES_EXTO=600
TOKEN_CRYPTO_STRING=<YOU_CRYPTO_TOKEN>
TOKEN_CRYPTO_HASH='aes256'
FORGET_EXPIRE_AT=86400
CAMPAIGN_DOMAIN='CAMPAIGN_DOMAIN_URL_WITH_HTTP_OR_HTTPS'

MODULE_SUFFIX=.model.js
API_DIR_PATH='./server/api'

API_PATH='/api/user/'
PURCHASE_QUANTITY=1

AWS_KEY='AWS_KEY'
AWS_SECRET='AWS_SECRET'
AWS_REGION='AWS_REGION'
AWS_ACL='public-read'
AWS_BUCKET='AWS_BUCKET'
AWS_UPLOAD='AWS_UPLOAD_PATH'
AWS_FILE_SIZE=2097152 // bytes 2 MB
AWS_PATTERN='/jpe?g|png|gif/i'
AWS_API_VERSION='2006-03-01'
AWS_PATH='https://AWS_BUCKET_NAME.s3.amazonaws.com/'


NEO4J_HOST=localhost
NEO4J_USER=neo4j
NEO4J_PASS=message2681
NEO4J_PORT=7474
NEO4J_PROTOCOL='http'

ALLOW_ORIGIN='CORS_COMMA_SEPARATED_LIST'

AUTHY_API_KEY=<YOUR_API_KEY_FOR_AUTHY>

EXPAY_AUTH_KEY=<YOUR_EXPAY_AUTH_KEY>
EXPAY_AUTH_SECRET=<YOUR_EXPAY_AUTH_SECRET>
EXPAY_AUTH_URL='https://api.sandbox.expay.asia/merchant/'
EXPAY_AUTH_PAYMENT_TYPE=84
```

