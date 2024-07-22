const { Category } = require(`../models/index.js`);

class CategoryController {
    static async createCategory(req, res) {
        try {
            const { name } = req.body;
            
            const category = await Category.create({
                name
            });

            res.status(201).json(category);
        } catch (error) {
            if(error.name === `SequelizeValidationError`) {
                res.status(400).json({ message: error.errors[0].message });
            } else {
                res.status(500).json({ message: `Internal Server Error` });
            }
        }
    }

    static async getCategories(req, res) {
        try {
            const categories = await Category.findAll();

            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: `Internal Server Error` });
        }
    }

    static async updateCategoryById(req, res) {
        try {
            const { categoryId } = req.params;
            const { name } = req.body;

            const category = await Category.findByPk(categoryId);

            if (!category) {
                res.status(404).json({ message: `Product with id ${categoryId} not found`})
            } else {
                await category.update({
                    name
                });

                res.status(200).json(category);
            }
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