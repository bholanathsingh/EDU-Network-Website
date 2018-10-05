var index = require('./index');
var auth = require('./authenticate');
var user = require('./users');

module.exports = function (app) {
    app.use('/auth', auth);
    app.use('/api/user', user);
    app.use('/api',index);
};
