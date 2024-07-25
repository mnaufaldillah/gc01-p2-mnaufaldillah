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

        token = signToken({ id: 1 });
        // console.log(token, `<----------- token di before all`);
        tokenStaff = signToken({ id: 3});
    } catch (error) {
        // console.log(error, '<<<<< error beforeall');
    }
})

afterAll(async () => {
    try {
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

describe(`POST /categories`, () => {
    describe(`Success`, () => {
        test(`Success Created 201`, async () => {
            const response = await request(app)
                .post(`/categories`)
                .send({ 
                    name: `Big Cat Stuff`,
                })
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(token, `<----------- token`);
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`id`, 6);
            expect(response.body).toHaveProperty(`name`, `Big Cat Stuff`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .post(`/categories`)
                .send({ 
                    name: `Big Cat Stuff`,
                });

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Unauthenticated`);
        })

        test(`Failed 500, Invalid Token`, async () => {
            const response = await request(app)
                .post(`/categories`)
                .send({ 
                    name: `Big Cat Stuff`,
                })
                .set(`Authorization`, `Bearer ${token}fwfbda`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `invalid signature`);
        })

        test(`Failed 400, No Product Name Validation`, async () => {
            const response = await request(app)
                .post(`/categories`)
                .send({ 
                    name: ``,
                })
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Category Name is Required`);
        })
    })
})

describe(`GET /categories`, () => {
    describe(`Success`, () => {
        test(`Success 200`, async () => {
            const response = await request(app)
                .get(`/categories`)
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty(`id`, expect.any(Number));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .get(`/categories`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Unauthenticated`);
        })

        test(`Failed 500, Invalid Token`, async () => {
            const response = await request(app)
                .get(`/categories`)
                .set(`Authorization`, `Bearer ${token}fwfbda`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `invalid signature`);
        })
    })
})

describe(`PUT /categories/:categoryId`, () => {
    describe(`Success`, () => {
        test(`Success 200`, async () => {
            const categoryId = 3;
            const response = await request(app)
                .put(`/categories/${categoryId}`)
                .send({ 
                    name: `Big Cat Stuff`,
                })
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(token, `<----------- token`);
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`id`, categoryId);
            expect(response.body).toHaveProperty(`name`, `Big Cat Stuff`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const categoryId = 3;
            const response = await request(app)
                .put(`/categories/${categoryId}`)
                .send({ 
                    name: `Big Cat Stuff`,
                });

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Unauthenticated`);
        })

        test(`Failed 500, Invalid Token`, async () => {
            const categoryId = 3;
            const response = await request(app)
                .put(`/categories/${categoryId}`)
                .send({ 
                    name: `Big Cat Stuff`,
                })
                .set(`Authorization`, `Bearer ${token}fwfbda`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `invalid signature`);
        })

        test(`Failed 404, Category Not Found`, async () => {
            const categoryId = 13;
            const response = await request(app)
                .put(`/categories/${categoryId}`)
                .send({ 
                    name: `Big Cat Stuff`,
                })
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Category with id ${categoryId} not found`);
        })

        test(`Failed 400, No Product Name Validation`, async () => {
            const categoryId = 3;
            const response = await request(app)
                .put(`/categories/${categoryId}`)
                .send({ 
                    name: ``,
                })
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Category Name is Required`);
        })
    })
})

describe(`DELETE /categories/:categoryId`, () => {
    describe(`Success`, () => {
        test(`Success 200`, async () => {
            const categoryId = 2;
            const categoryName = `Sport Stuff`;
            const response = await request(app)
                .delete(`/categories/${categoryId}`)
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(token, `<----------- token`);
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `${categoryName} success to delete`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const categoryId = 2;
            const categoryName = `Sport Stuff`;
            const response = await request(app)
                .delete(`/categories/${categoryId}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Unauthenticated`);
        })

        test(`Failed 500, Invalid Token`, async () => {
            const categoryId = 2;
            const categoryName = `Sport Stuff`;
            const response = await request(app)
                .delete(`/categories/${categoryId}`)
                .set(`Authorization`, `Bearer ${token}fwfbda`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `invalid signature`);
        })

        test(`Failed 404, Category Not Found`, async () => {
            const categoryId = 13;
            const categoryName = `Sport Stuff`;
            const response = await request(app)
                .delete(`/categories/${categoryId}`)
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Category with id ${categoryId} not found`);
        })
    })
})