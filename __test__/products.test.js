const request = require(`supertest`);
const app = require(`../app.js`);
const fs = require(`fs`).promises;
const { sequelize, User, Product, Category }  = require(`../models/index.js`);
const { queryInterface } = sequelize
const { hashPassword } = require(`../helpers/bcrypt.js`);
const { signToken } = require(`../helpers/jwt.js`);

let token
let tokenStaff

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

        token = signToken({ id: 1 });
        // console.log(token, `<----------- token di before all`);
        tokenStaff = signToken({ id: 3});
    } catch (error) {
        // console.log(error, '<<<<< error beforeall');
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
        console.log(error);
    }
})

describe(`POST /products`, () => {
    describe(`Success`, () => {
        test(`Success Created 201`, async () => {
            const response = await request(app)
                .post(`/products`)
                .send({ 
                    name: `Wireless Noise-Cancelling Headphones`,
                    description: `Crystal clear sound`,
                    price: 78000,
                    stock: 15,
                    categoryId: 3
                })
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(token, `<----------- token`);
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`id`, 21);
            expect(response.body).toHaveProperty(`name`, `Wireless Noise-Cancelling Headphones`);
            expect(response.body).toHaveProperty(`description`, `Crystal clear sound`);
            expect(response.body).toHaveProperty(`price`, 78000);
            expect(response.body).toHaveProperty(`stock`, 15);
            expect(response.body).toHaveProperty(`categoryId`, 3);
            expect(response.body).toHaveProperty(`authorId`, 1);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .post(`/products`)
                .send({ 
                    name: `Wireless Noise-Cancelling Headese`,
                    description: `Crystal clear sound v2`,
                    price: 78000,
                    stock: 15,
                    categoryId: 3
                });

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Unauthenticated`);
        })

        test(`Failed 500, Invalid Token`, async () => {
            const response = await request(app)
                .post(`/products`)
                .send({ 
                    name: `Wireless Noise-Cancelling Headphones`,
                    description: `Crystal clear sound`,
                    price: 78000,
                    stock: 15,
                    categoryId: 3
                })
                .set(`Authorization`, `Bearer ${token}fwfbda`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `invalid signature`);
        })

        test(`Failed 400, No Product Name Validation`, async () => {
            const response = await request(app)
                .post(`/products`)
                .send({ 
                    name: ``,
                    description: `Crystal clear sound`,
                    price: 78000,
                    stock: 15,
                    categoryId: 3
                })
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Product Name is Required`);
        })
    })
})