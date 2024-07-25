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

        test(`Failed 400, Price Below Minimum Price`, async () => {
            const response = await request(app)
                .post(`/products`)
                .send({ 
                    name: `Wireless Noise-Cancelling Headphones`,
                    description: `Crystal clear sound`,
                    price: 3000,
                    stock: 15,
                    categoryId: 3
                })
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Minimum Product Price is Rp. 5.000,00`);
        })
    })
})

describe(`GET /products`, () => {
    describe(`Success`, () => {
        test(`Success 200`, async () => {
            const response = await request(app)
                .get(`/products`)
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty(`id`, expect.any(Number));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .get(`/products`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Unauthenticated`);
        })

        test(`Failed 500, Invalid Token`, async () => {
            const response = await request(app)
                .get(`/products`)
                .set(`Authorization`, `Bearer ${token}fwfbda`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `invalid signature`);
        })
    })
})

describe(`GET /products/:productId`, () => {
    describe(`Success`, () => {
        test(`Success 200`, async () => {
            const productId = 3;
            const response = await request(app)
                .get(`/products/${productId}`)
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`id`, productId);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const productId = 3;
            const response = await request(app)
                .get(`/products/${productId}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Unauthenticated`);
        })

        test(`Failed 500, Invalid Token`, async () => {
            const productId = 3;
            const response = await request(app)
                .get(`/products/${productId}`)
                .set(`Authorization`, `Bearer ${token}fwfbda`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `invalid signature`);
        })

        test(`Failed 404, Product Not Found`, async () => {
            const productId = 24;
            const response = await request(app)
                .get(`/products/${productId}`)
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Product with id ${productId} not found`);
        })
    })
})

describe(`PUT /products/:productId`, () => {
    describe(`Success`, () => {
        test(`Success 200`, async () => {
            const productId = 3;
            const response = await request(app)
                .put(`/products/${productId}`)
                .send({ 
                    name: `Wireless Noise-Cancelling Headphones`,
                    description: `Crystal clear sound`,
                    price: 78000,
                    stock: 15,
                    categoryId: 3
                })
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`id`, 3);
            expect(response.body).toHaveProperty(`name`, `Wireless Noise-Cancelling Headphones`);
            expect(response.body).toHaveProperty(`description`, `Crystal clear sound`);
            expect(response.body).toHaveProperty(`price`, 78000);
            expect(response.body).toHaveProperty(`stock`, 15);
            expect(response.body).toHaveProperty(`categoryId`, 3);
            expect(response.body).toHaveProperty(`authorId`, 3);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const productId = 3;
            const response = await request(app)
                .put(`/products/${productId}`)
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
            const productId = 3;
            const response = await request(app)
                .put(`/products/${productId}`)
                .send({ 
                    name: `Wireless Noise-Cancelling Headese`,
                    description: `Crystal clear sound v2`,
                    price: 78000,
                    stock: 15,
                    categoryId: 3
                })
                .set(`Authorization`, `Bearer ${token}fwfbda`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `invalid signature`);
        })

        test(`Failed 404, Product Not Found`, async () => {
            const productId = 24;
            const response = await request(app)
                .put(`/products/${productId}`)
                .send({ 
                    name: `Wireless Noise-Cancelling Headese`,
                    description: `Crystal clear sound v2`,
                    price: 78000,
                    stock: 15,
                    categoryId: 3
                })
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Product with id ${productId} not found`);
        })

        test(`Failed 403, Forbidden Updating Product for the Staff that are not their product`, async () => {
            const productId = 5;
            const response = await request(app)
                .put(`/products/${productId}`)
                .send({ 
                    name: `Wireless Noise-Cancelling Headese`,
                    description: `Crystal clear sound v2`,
                    price: 78000,
                    stock: 15,
                    categoryId: 3
                })
                .set(`Authorization`, `Bearer ${tokenStaff}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Forbidden Action`);
        })

        test(`Failed 400, No Name Input`, async () => {
            const productId = 3;
            const response = await request(app)
                .put(`/products/${productId}`)
                .send({ 
                    name: ``,
                    description: `Crystal clear sound v2`,
                    price: 78000,
                    stock: 15,
                    categoryId: 3
                })
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Product Name is Required`);
        })

        test(`Failed 400, Price Below Minimum Price`, async () => {
            const productId = 3;
            const response = await request(app)
                .put(`/products/${productId}`)
                .send({ 
                    name: `Wireless Noise-Cancelling Headphones`,
                    description: `Crystal clear sound`,
                    price: 3000,
                    stock: 15,
                    categoryId: 3
                })
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Minimum Product Price is Rp. 5.000,00`);
        })
    })
})

describe(`DELETE /products/:productId`, () => {
    describe(`Success`, () => {
        test(`Success 200`, async () => {
            const productId = 7;
            const productName = `Electric Wine Opener`;
            const response = await request(app)
                .delete(`/products/${productId}`)
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `${productName} success to delete`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 401, Unauthenticated No Token`, async () => {
            const productId = 7;
            const productName = `Electric Wine Opener`;
            const response = await request(app)
                .delete(`/products/${productId}`);

        // console.log(response.body, `<---------- response body`);

        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(`message`, `Unauthenticated`);
        })

        test(`Failed 500, Invalid Token`, async () => {
            const productId = 3;
            const productName = `Electric Wine Opener`;
            const response = await request(app)
                .delete(`/products/${productId}`)
                .set(`Authorization`, `Bearer ${token}fwfbda`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `invalid signature`);
        })

        test(`Failed 404, Product Not Found`, async () => {
            const productId = 24;
            const response = await request(app)
                .delete(`/products/${productId}`)
                .set(`Authorization`, `Bearer ${token}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Product with id ${productId} not found`);
        })

        test(`Failed 403, Forbidden Updating Product for the Staff that are not their product`, async () => {
            const productId = 5;
            const productName = `Wireless Noise-Cancelling Headese`
            const response = await request(app)
                .delete(`/products/${productId}`)
                .set(`Authorization`, `Bearer ${tokenStaff}`);

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Forbidden Action`);
        })
    })
})