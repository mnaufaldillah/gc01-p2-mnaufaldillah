const ProductController = require("../controllers/ProductController");
const router = require(`express`).Router();
const authorization = require("../middlewares/authorization.js");
const multer = require(`multer`);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(`/`, ProductController.createProduct);
router.get(`/`, ProductController.getProducts);
router.get(`/:productId`, ProductController.getProductById);
router.put(`/:productId`, authorization, ProductController.updateProductById);
router.delete(`/:productId`, authorization, ProductController.deleteProductById);
router.patch(`/:productId/upload-image`, authorization, upload.single(`image`), ProductController.uploadImageProductById);

module.exports = router;