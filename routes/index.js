const router = require(`express`).Router();
const routerProduct = require(`./products.js`);
const routerCategory = require(`./categories.js`);

router.use(`/products`, routerProduct);
router.use(`/categories`, routerCategory);

module.exports = router