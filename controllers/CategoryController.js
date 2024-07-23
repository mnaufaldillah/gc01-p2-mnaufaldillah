const { Category } = require(`../models/index.js`);

class CategoryController {
    static async createCategory(req, res, next) {
        try {
            const { name } = req.body;
            
            const category = await Category.create({
                name
            });

            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }

    static async getCategories(req, res, next) {
        try {
            const categories = await Category.findAll();

            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    static async updateCategoryById(req, res, next) {
        try {
            const { categoryId } = req.params;
            const { name } = req.body;

            const category = await Category.findByPk(categoryId);

            if (!category) {
                throw { name: `NotFound`, message: `Category with id ${categoryId} not found`};
            }

            await category.update({
                name
            });

            res.status(200).json(category);
        } catch (error) {
            next(error);
        }
    }

    static async deleteCategoryById(req, res, next) {
        try {
            const { categoryId } = req.params;

            const category = await Category.findByPk(categoryId);

            if (!category) {
                throw { name: `NotFound`, message: `Category with id ${categoryId} not found`};
            } 

            const categoryName = category.name;
            await category.destroy();

            res.status(200).json({ message: `${categoryName} success to delete`});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CategoryController;