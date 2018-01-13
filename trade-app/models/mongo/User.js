let mongoose   = require('./index');
let Schema     = mongoose.Schema;

const UserSchema = new Schema({
    fname: { type: String },
    lname: { type: String },
    email: { type: String, unique: true },
    hashpass: { type: String },
    mobile: { type: String },
    username: { type: String, unique: true },
    sponsorid: { type: Object },
    sponsorname: { type: String },
    sponsorusername: { type: String },
    ip: { type: String },
    address: { type: String },
    country: { type: String },
    city: { type: String },
    state: { type: String },
    postal: { type: String },
    image: { type: String },
    verifed: { type: String },
    accountid: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
    unix_date: { type: Number },
    verify_email: { type: Boolean },
    enable_2fa: { type: Boolean },
    enable_google: { type: Boolean },
    enable_authy: { type: Boolean },
    external_id: { type: String },
    role: { type: Array },
    is_blocked: { type: Boolean }
});

const UserSchema = mongoose.model('Trader', UserSchema);

export default UserSchema;
