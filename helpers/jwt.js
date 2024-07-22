const jwt = require(`jsonwebtoken`);

const secret = process.env.SECRET;
console.log(secret);

const signToken = (payload) => {
    return jwt.sign(payload, secret);
}

module.exports = { signToken }