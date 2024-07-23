const { Product } = require(`../models/index.js`);

async function authorization(req, res, next) {
    try {
        const { productId } = req.params;
        const product = await Product.findByPk(productId);

        if(!product) {
            throw { name: `NotFound`, message: `Product with id ${productId} not found`};
        }

        if(req.role === `Admin`) {
            next();
        } else {
            if(product.authorId !== req.user) {
                throw { name: `Forbidden`};
            }

            next();
        }
    } catch (error) {
        next(error);
    }
}

module.exports = authorization