var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    UserName: String,
    Password: String,
    DisplayName: { type: String, default: ''},
    ProviderId: { type: String, default: ''},
    Provider: { type: String, default: ''},
    Gender: { type: String, default: ''},
    Photo: { type: String, default: ''},
    Email: { type: String, default: ''},
    PhoneNumber: { type: String, default: ''},
    ProviderData:{ type:Object, default: null},
    DeviceId:{ type: String, default: ''},
    AcessTocken:{ type: String, default: ''},
    ReferralCode:{ type: String, default: ''},
    YourReferralCode:{ type: String, default: ''},
    LastLoginTime:{ type: Date, default: Date.now },
    CreatedDate: { type: Date, default: Date.now },
    IsActive:{ type: Boolean, default: true }
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUsers = function (callback, limit) {
    User.find(callback).limit(limit);
}

module.exports.getUser = function (query, callback) {
    // console.log(query);
    User.findOne(query,{}, callback);
}

module.exports.addUser = function (user, callback) {
    User.create(user, callback);
}

// module.exports.updateUser = function (query, updatequery, option, callback) {
//     User.findByIdAndUpdate(query, updatequery, option, callback);
// }

module.exports.updateUser = function (query, updatequery, option, callback) {
    User.findOneAndUpdate(query, updatequery, option, callback);
}


module.exports.removeUser = function (query, callback) {
    User.remove(query, callback);
}


module.exports.getUserCount = function (query, callback) {
    User.count(query, callback);
}



module.exports.getUserAutocomplete = function (fields,query, callback, shortexp, limit) {
    User.distinct(fields,query, callback);
}


module.exports.getUserList = function (query, callback, shortexp, page, limit) {
    console.log(query);
    User.find(query, callback).sort(shortexp).skip(page * limit).limit(limit);
}