const { Category } = require(`../models/index.js`);

class CategoryController {
    static async createCategory(req, res) {
        try {
            const { name } = req.body;
            console.log(name);
        } catch (error) {
            if(error.name === `SequelizeValidationError`) {
                res.status(400).json({ message: error.errors[0].message });
            } else {
                res.status(500).json({ message: `Internal Server Error` });
            }
        }
    }
}

module.exports = CategoryController;