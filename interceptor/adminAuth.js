const jwt = require('jwt-simple');
var User = require('../lib/mongo').User;
module.exports = function (req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        try {
            var decoded = jwt.decode(token,'recordAdmin');
            if (decoded.exp <= Date.now()) {
                return res.json({
                    code: 400,
                    msg: 'Access token has expires'
                })
            }
            User.findOne({ _id: decoded.iss}, (err, user) => {
                if (err) {
                    return res.json({
                        code: 401,
                        msg: '身份验证失败'
                    })
                }
                user.password = null;
                req.user = user;
                next();
            })

        } catch (err) {
            return res.json({
                        code: 402,
                        msg: '身份验证失败'
                    })
        }
    } else {
        return res.json({
                        code: 403,
                        msg: '身份验证失败'
                    })
    }
}