const { Op } = require("sequelize");
const { Product, User, Category } = require(`../models/index.js`);

class PublicController {
    static async getProducts(req, res, next) {
        try {
            const { categoryId, createdAt, search, page } = req.query;
            let queryOptions = {
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
                ],
                where: {

                },
                order: [

                ],
                limit: 10,
                offset: 0
            };

            //search
            if(search) {
                queryOptions.where.name = {
                    [Op.iLike]: `%${search}%`
                }
            }

            // filter
            if(categoryId) {
                queryOptions.where.categoryId = categoryId;
            }

            // sort
            if(createdAt) {
                const ordering = createdAt === `DESC` ? `DESC` : `ASC`;

                queryOptions.order.push([`createdAt`, ordering]);
            }

            // pagination
            if(page) {
                queryOptions.offset = queryOptions.limit * (page - 1);
            }

            const {count, rows} = await Product.findAndCountAll(queryOptions);

            res.status(200).json({
                page: page || 1,
                totalData: count,
                totalPage: Math.ceil(count/queryOptions.limit),
                dataPerPage: queryOptions.limit,
                products: rows
            });
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

    static async getCategories(req, res, next) {
        try {
            const categories = await Category.findAll();

            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PublicController;