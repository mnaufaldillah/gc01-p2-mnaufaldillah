const ProductController = require("../controllers/ProductController");

const router = require(`express`).Router();

router.post(`/`, ProductController.createProduct);
router.get(`/`, ProductController.getProducts);
router.get(`/:productId`, ProductController.getProductById);

module.exports = router;