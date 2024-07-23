const { where } = require("sequelize");
const { Product, User, Category } = require(`../models/index.js`);
const cloudinary = require(`cloudinary`).v2;

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

            // const product = await Product.findByPk(productId);

            // if (!product) {
            //     throw { name: `NotFound`, message: `Product with id ${productId} not found`};
            // }

            const product = await Product.update({
                name, 
                description, 
                price, 
                stock, 
                categoryId
            }, {
                where: {
                    id: productId
                },
                returning: true
            });

            res.status(200).json(product[1][0]);
        } catch (error) {
            next(error);
        }
    }

    static async uploadImageProductById(req, res, next) {
        try {
            const { productId } = req.params;

            // const product = await Product.findByPk(productId);

            // if (!product) {
            //     throw { name: `NotFound`, message: `Product with id ${productId} not found`};
            // }

            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

            const b64file = Buffer.from(req.file.buffer).toString(`base64`);

            const dataURI = `data:${req.file.mimetype};base64,${b64file}`;

            const uploadFile = await cloudinary.uploader.upload(dataURI, {
                folder: `graded-challenge1`,
                public_id: req.file.originalname
            });

            await Product.update({
                imgUrl: uploadFile.secure_url
            }, {
                where: {
                    id: productId
                }
            });

            res.status(200).json({ message: `Product Image success to update`});
        } catch (error) {
            next(error);
        }
    }

    static async deleteProductById(req, res, next) {
        try {
            const { productId } = req.params;

            const product = await Product.findByPk(productId);

            // if (!product) {
            //     throw { name: `NotFound`, message: `Product with id ${productId} not found`};
            // }

            const productName = product.name;
            await product.destroy();

            res.status(200).json({ message: `${productName} success to delete`});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductController;