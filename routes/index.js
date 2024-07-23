const router = require(`express`).Router();
const routerProduct = require(`./products.js`);
const routerCategory = require(`./categories.js`);
const routerPublic = require(`./public.js`);
const UserController = require("../controllers/UserController.js");
const authorizationRegister = require("../middlewares/authorizationRegister.js");
const authentication = require(`../middlewares/authentication.js`);

router.use(`/pub`, routerPublic);
router.post(`/login`, UserController.handlerLogin);

router.use(authentication);

router.post(`/add-user`, authorizationRegister, UserController.handlerAddUser);

router.use(`/products`, routerProduct);
router.use(`/categories`, routerCategory);

module.exports = router