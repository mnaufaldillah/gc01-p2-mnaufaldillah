const request = require(`supertest`);
const app = require(`../app.js`);
const fs = require(`fs`).promises;
const { sequelize, User, Product, Category }  = require(`../models/index.js`);
const { queryInterface } = sequelize
const { hashPassword } = require(`../helpers/bcrypt.js`);

beforeAll(async () => {
    try {
        let dataUser = await fs.readFile(`./data/user.json`, `utf8`);
        dataUser = JSON.parse(dataUser);
        dataUser = dataUser.map((item) => {
            delete item.id;
            item.password = hashPassword(item.password);
            item.createdAt = new Date();
            item.updatedAt = new Date();
            return item;
        });

        let dataCategory = await fs.readFile(`./data/category.json`, `utf8`);
        dataCategory = JSON.parse(dataCategory);
        dataCategory = dataCategory.map((item) => {
            delete item.id;
            item.createdAt = new Date();
            item.updatedAt = new Date();
            return item;
        });

        let dataProduct = await fs.readFile(`./data/product.json`, `utf8`);
        dataProduct = JSON.parse(dataProduct);
        dataProduct = dataProduct.map((item) => {
            delete item.id;
            item.createdAt = new Date();
            item.updatedAt = new Date();
            return item;
        });

        // console.log(dataProduct, `<--------- data product -----`);

        await queryInterface.bulkInsert(`Users`, dataUser, {});
        await queryInterface.bulkInsert(`Categories`, dataCategory, {});
        await queryInterface.bulkInsert(`Products`, dataProduct, {});
    } catch (error) {
        console.log(error, '<<<<< error beforeall');
    }
})

afterAll(async () => {
    try {
        await queryInterface.bulkDelete(`Products`, null, {
            truncate: true,
            restartIdentity: true,
            cascade: true
        });
        await queryInterface.bulkDelete(`Users`, null, {
            truncate: true,
            restartIdentity: true,
            cascade: true
        });
        await queryInterface.bulkDelete(`Categories`, null, {
            truncate: true,
            restartIdentity: true,
            cascade: true
        });
    } catch (error) {
        console.log(error, `<---------- ERROR AfterALL`);
    }
})

describe(`GET /pub/products`, () => {
    describe(`Success`, () => {
        test(`Success Without Query 200`, async () => {
            const response = await request(app)
                .get(`/pub/products`);

            // console.log(response.body, `<--------- data product -----`);

            expect(response.body.products).toBeInstanceOf(Array);
            expect(response.body.products[0]).toHaveProperty(`id`, 1);
        })

        test(`Success Wiith Filter Query 200`, async () => {
            const categoryId = 1
            const response = await request(app)
                .get(`/pub/products?categoryId=${categoryId}`);

            // console.log(response.body, `<--------- data product -----`);

            expect(response.body.products).toBeInstanceOf(Array);
            expect(response.body.products[0]).toHaveProperty(`id`, expect.any(Number));
        })

        test(`Success Wiith Pagination 200`, async () => {
            const page = 2
            const response = await request(app)
                .get(`/pub/products?page=${page}`);

            // console.log(response.body, `<--------- data product -----`);

            expect(response.body.products).toBeInstanceOf(Array);
            expect(response.body.products[0]).toHaveProperty(`id`, expect.any(Number));
            expect(response.body.products.length).toBe(10);
        })
    })
})