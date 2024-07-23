const PublicController = require("../controllers/PublicController");
const router = require(`express`).Router();

router.get(`/`, PublicController.getProducts);
router.get(`/:productId`, PublicController.getProductById);

module.exports = router;