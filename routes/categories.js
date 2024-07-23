const CategoryController = require("../controllers/CategoryController");
const authentication = require(`../middlewares/authentication.js`);
const router = require(`express`).Router();

router.post(`/`, CategoryController.createCategory);
router.get(`/`, CategoryController.getCategories);
router.put(`/:categoryId`, CategoryController.updateCategoryById);
router.delete(`/:categoryId`, CategoryController.deleteCategoryById);

module.exports = router;