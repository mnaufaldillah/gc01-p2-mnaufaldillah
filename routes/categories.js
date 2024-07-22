const CategoryController = require("../controllers/CategoryController");
const router = require(`express`).Router();

router.post(`/`, CategoryController.createCategory);

module.exports = router;