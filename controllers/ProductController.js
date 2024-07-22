const { Product } = require(`../models/index.js`);

class ProductController {
    static async createProduct(req, res) {
        try {
            const { name, description, price, stock, categoryId, authorId } = req.body;
            console.log(name, description, price, stock, categoryId, authorId);

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
                console.log(error);
                res.status(500).json({ message: `Internal Server Error` });
            }
        }
    }
}

module.exports = ProductController;