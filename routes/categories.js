const ProductController = require(`../controllers/ProductController.js`);
const router = require(`express`).Router();

router.post(`/`, ProductController.createProduct)

module.exports = router;