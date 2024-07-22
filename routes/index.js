const router = require(`express`).Router();
const routerProduct = require(`./products.js`);
const routerCategory = require(`./categories.js`);
const UserController = require("../controllers/UserController.js");

router.post(`/add-user`, UserController.handlerAddUser);
router.post(`/login`, UserController.handlerLogin);

router.use(`/products`, routerProduct);
router.use(`/categories`, routerCategory);

module.exports = router