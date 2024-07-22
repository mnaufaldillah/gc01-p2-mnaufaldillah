const CategoryController = require("../controllers/CategoryController");
const router = require(`express`).Router();

router.post(`/`, CategoryController.createCategory);
router.get(`/`, CategoryController.getCategories);

module.exports = router;