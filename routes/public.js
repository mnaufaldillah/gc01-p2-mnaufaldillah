const PublicController = require("../controllers/PublicController");
const router = require(`express`).Router();

router.get(`/products`, PublicController.getProducts);
router.get(`/products/:productId`, PublicController.getProductById);
router.get(`/categories`, PublicController.getCategories);

module.exports = router;