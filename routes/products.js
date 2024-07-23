const ProductController = require("../controllers/ProductController");
const router = require(`express`).Router();
const authentication = require(`../middlewares/authentication.js`);
const authorization = require("../middlewares/authorization.js");

router.post(`/`, ProductController.createProduct);
router.get(`/`, ProductController.getProducts);
router.get(`/:productId`, ProductController.getProductById);
router.put(`/:productId`, authorization, ProductController.updateProductById);
router.delete(`/:productId`, authorization, ProductController.deleteProductById)

module.exports = router;