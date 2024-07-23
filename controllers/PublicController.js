const { Product, User, Category } = require(`../models/index.js`);

class PublicController {
    static async getProducts(req, res, next) {
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
            next(error);
        }
    }

    static async getProductById(req, res, next) {
        try {
            const { productId } = req.params

            const product = await Product.findByPk(productId, {
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

            if (!product) {
                throw { name: `NotFound`, message: `Product with id ${productId} not found`};
            }

            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PublicController;