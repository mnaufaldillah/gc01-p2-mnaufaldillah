const ProductController = require("../controllers/ProductController");

const router = require(`express`).Router();

router.post(`/`, ProductController.createProduct);
router.get(`/`, ProductController.getProducts);

module.exports = router;