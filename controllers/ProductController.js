const { Product, User, Category } = require(`../models/index.js`);

class ProductController {
    static async createProduct(req, res) {
        try {
            const { name, description, price, stock, categoryId, authorId } = req.body;

            const product = await Product.create({
                name,
                description,
                price,
                stock,
                categoryId,
                authorId
            });

            res.status(201).json(product);
        } catch (error) {
            if(error.name === `SequelizeValidationError`) {
                res.status(400).json({ message: error.errors[0].message });
            } else {
                res.status(500).json({ message: `Internal Server Error` });
            }
        }
    }

    static async getProducts(req, res) {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: User,
                        attributes: {
                            exclude: [`password`]
                        }
                    },
                    {
                        model: Category
                    }
                ]
            });

            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: `Internal Server Error` });
        }
    }
}

module.exports = ProductController;