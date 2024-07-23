const { User } = require(`../models/index.js`);

async function authorizationRegister(req, res, next) {
    try {
        if(req.role !== `Admin`) {
            throw { name: `Forbidden`};
        }

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authorizationRegister;