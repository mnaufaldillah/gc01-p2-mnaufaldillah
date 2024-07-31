const { comparePassword } = require(`../helpers/bcrypt.js`);
const { User } = require(`../models/index.js`);
const { signToken } = require(`../helpers/jwt.js`);
const { where } = require("sequelize");

class UserController {
    static async handlerAddUser(req, res, next) {
        try {
            const { email, password, phoneNumber, address, username } = req.body;

            const newUser = await User.create({
                email,
                password,
                phoneNumber,
                address,
                username
            });

            res.status(201).json({
                id: newUser.id,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                address: newUser.address,
                username: newUser.username
            });
        } catch (error) {
            next(error);
        }
    }

    static async handlerLogin(req, res, next) {
        try {
            const { email, password } = req.body;

            if(!email || !password ) {
                throw { name: `CredentialsRequired`, message: `Email and Password is Required`};
            }

            const foundUser = await User.findOne({
                where: {
                    email
                }
            });

            if(!foundUser) {
                throw { name: `Unauthorized`, message: `Email or Password is Invalid`};
            }

            const comparedPass = comparePassword(password, foundUser.password);

            if(!comparedPass) {
                throw { name: `Unauthorized`, message: `Email or Password is Invalid`};
            }

            const access_token = signToken({id: foundUser.id});

            // console.log(access_token);

            res.status(200).json({access_token});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController