const CategoryController = require("../controllers/CategoryController");
const router = require(`express`).Router();

router.post(`/`, CategoryController.createCategory);
router.get(`/`, CategoryController.getCategories);
router.put(`/:categoryId`, CategoryController.updateCategoryById);

module.exports = router;