module.exports = function (req, res, next) {
        if (!req.session.user) {
            return res.json({
                code: 403,
                message:'无权访问'
            })
        }
        next();
    }