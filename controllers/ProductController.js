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

    static async getProductById(req, res) {
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
                res.status(404).json({ message: `Product with ${productId} not found`})
            } else {
                res.status(200).json(product);
            }
        } catch (error) {
            res.status(500).json({ message: `Internal Server Error` });
        }
    }

    static async updateProductById(req, res) {
        try {
            const { productId } = req.params;
            const { name, description, price, stock, categoryId, authorId } = req.body;

            const product = await Product.findByPk(productId);

            if (!product) {
                res.status(404).json({ message: `Product with id ${productId} not found`})
            } else {
                await product.update({
                    name, 
                    description, 
                    price, 
                    stock, 
                    categoryId, 
                    authorId
                });

                res.status(200).json(product);
            }
        } catch (error) {
            if(error.name === `SequelizeValidationError`) {
                res.status(400).json({ message: error.errors[0].message });
            } else {
                res.status(500).json({ message: `Internal Server Error` });
            }
        }
    }

    static async deleteProductById(req, res) {
        try {
            const { productId } = req.params;

            const product = await Product.findByPk(productId);

            if (!product) {
                res.status(404).json({ message: `Product with id ${productId} not found`})
            } else {
                const productName = product.name;
                await product.destroy();

                res.status(200).json({ message: `${productName} success to delete`});
            }
        } catch (error) {
            res.status(500).json({ message: `Internal Server Error` });
        }
    }

    static async getProductsPublic(req, res) {
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