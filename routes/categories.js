const CategoryController = require("../controllers/CategoryController");
const authentication = require(`../middlewares/authentication.js`);
const router = require(`express`).Router();

router.post(`/`, authentication, CategoryController.createCategory);
router.get(`/`, authentication, CategoryController.getCategories);
router.put(`/:categoryId`, authentication, CategoryController.updateCategoryById);
router.delete(`/:categoryId`, authentication, CategoryController.deleteCategoryById);

module.exports = router;