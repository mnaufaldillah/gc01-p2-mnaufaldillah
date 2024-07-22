const { comparePassword } = require(`../helpers/bcrypt.js`);
const { User } = require(`../models/index.js`);
const { signToken } = require(`../helpers/jwt.js`);
const { where } = require("sequelize");

class UserController {
    static async handlerAddUser(req, res) {
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
            })
        } catch (error) {
            if(error.name === `SequelizeValidationError`) {
                res.status(400).json({ message: error.errors[0].message });
            } else {
                res.status(500).json({ message: `Internal Server Error` });
            }
        }
    }

    static async handlerLogin(req, res) {
        try {
            const { email, password } = req.body;

            if(!email || !password ) {
                throw { name: `CredentialsRequired`}
            }

            const foundUser = await User.findOne({
                where: {
                    email
                }
            });

            if(!foundUser) {
                throw { name: `Unauthorized`}
            }

            const comparedPass = comparePassword(password, foundUser.password);

            if(!comparedPass) {
                throw { name: `Unauthorized`}
            }

            const access_token = signToken({id: foundUser.id});

            res.json({access_token})
        } catch (error) {
            switch (error.name) {
                case `CredentialsRequired`:
                    res.status(400).json({
                        message: `Email and Password is Required`
                    })
                    break;
                case `Unauthorized`:
                    res.status(401).json({
                        message: `Email and Password is Invalid`
                    })
                    break;
                default:
                    console.log(error);
                    res.status(500).json({
                        message: `Internal Server Error`
                    })
                    break;
            }
        }
    }
}

module.exports = UserController