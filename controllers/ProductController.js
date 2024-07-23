const { Product, User, Category } = require(`../models/index.js`);

class ProductController {
    static async createProduct(req, res, next) {
        try {
            const { name, description, price, stock, categoryId } = req.body;

            const product = await Product.create({
                name,
                description,
                price,
                stock,
                categoryId,
                authorId : req.user
            });

            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

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
            next(error)
        }
    }

    static async updateProductById(req, res, next) {
        try {
            const { productId } = req.params;
            const { name, description, price, stock, categoryId } = req.body;

            const product = await Product.findByPk(productId);

            if (!product) {
                throw { name: `NotFound`, message: `Product with id ${productId} not found`};
            }

            await product.update({
                name, 
                description, 
                price, 
                stock, 
                categoryId
            });

            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    static async deleteProductById(req, res, next) {
        try {
            const { productId } = req.params;

            const product = await Product.findByPk(productId);

            if (!product) {
                throw { name: `NotFound`, message: `Product with id ${productId} not found`};
            }

            const productName = product.name;
            await product.destroy();

            res.status(200).json({ message: `${productName} success to delete`});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductController;