const ProductController = require("../controllers/ProductController");

const router = require(`express`).Router();
const authentication = require(`../middlewares/authentication.js`);

router.post(`/`, authentication, ProductController.createProduct);
router.get(`/`, authentication, ProductController.getProducts);
router.get(`/pub`, ProductController.getProductsPublic);
router.get(`/pub/:productId`, ProductController.getProductByIdPublic);
router.get(`/:productId`, authentication, ProductController.getProductById);
router.put(`/:productId`, authentication, ProductController.updateProductById);
router.delete(`/:productId`, authentication, ProductController.deleteProductById)

module.exports = router;