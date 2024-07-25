const request = require(`supertest`);
const app = require(`../app.js`);
const fs = require(`fs`).promises;
const { sequelize, User }  = require(`../models/index.js`);
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

        await queryInterface.bulkInsert(`Users`, dataUser, {});

        token = signToken({ id: 1 });
        tokenStaff = signToken({ id: 3});
    } catch (error) {
        console.log(error);
    }
})

afterAll(async () => {
    try {
        await queryInterface.bulkDelete(`Users`, null, {
            truncate: true,
            restartIdentity: true,
            cascade: true
        })
    } catch (error) {
        console.log(error);
    }
})

describe(`POST /login`, () => {
    describe(`Success`, () => {
        test(`Success 200`, async () => {
            const response = await request(app)
                .post(`/login`)
                .send({ 
                    email: `mnaufaldillah@gmail.com`,
                    password: `12345`
                });

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`access_token`, expect.any(String));
        })
    })

    describe(`Failed`, () => {
        test(`Failed 400, No Email Input`, async () => {
            const response = await request(app)
                .post(`/login`)
                .send({ 
                    email: ``,
                    password: `12345`
                });

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Email and Password is Required`);
        })

        test(`Failed 400, No Password Input`, async () => {
            const response = await request(app)
                .post(`/login`)
                .send({ 
                    email: `mnaufaldillah@gmail.com`,
                    password: ``
                });

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Email and Password is Required`);
        })

        test(`Failed 400, Wrong Email Input`, async () => {
            const response = await request(app)
                .post(`/login`)
                .send({ 
                    email: `example@gmail.com`,
                    password: `12345`
                });

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Email or Password is Invalid`);
        })

        test(`Failed 400, Wrong Password Input`, async () => {
            const response = await request(app)
                .post(`/login`)
                .send({ 
                    email: `mnaufaldillah@gmail.com`,
                    password: `1234567`
                });

            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Email or Password is Invalid`);
        })
    })
})

describe(`POST /add-user`, () => {
    describe(`Success`, () => {
        test(`Success Created 201`, async () => {
            const response = await request(app)
                .post(`/add-user`)
                .send({ 
                    email: `mnaufaldillah@outlook.com`,
                    password: `12345`
                })
                .set(`Authorization`, `Bearer ${token}`);
            
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`email`, `mnaufaldillah@outlook.com`);
        })
    })

    describe(`Failed`, () => {
        test(`Failed 400, No Email Input`, async () => {
            const response = await request(app)
                .post(`/add-user`)
                .send({ 
                    password: `12345`
                })
                .set(`Authorization`, `Bearer ${token}`);
        
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Email is Required`);
        })

        test(`Failed 400, No Password Input`, async () => {
            const response = await request(app)
                .post(`/add-user`)
                .send({ 
                    email: `mnaufaldillah@outlook.com`
                })
                .set(`Authorization`, `Bearer ${token}`);
        
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Password is Required`);
        })

        test(`Failed 400, Empty String Email Input`, async () => {
            const response = await request(app)
                .post(`/add-user`)
                .send({ 
                    email: ``,
                    password: `12345`
                })
                .set(`Authorization`, `Bearer ${token}`);
        
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Email is Required`);
        })

        test(`Failed 400, Empty String Password Input`, async () => {
            const response = await request(app)
                .post(`/add-user`)
                .send({ 
                    email: `mnaufaldillah@outlook.com`,
                    password: ``
                })
                .set(`Authorization`, `Bearer ${token}`);
        
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Password is Required`);
        })

        test(`Failed 400, Email already in Use`, async () => {
            const response = await request(app)
                .post(`/add-user`)
                .send({ 
                    email: `mnaufaldillah@outlook.com`,
                    password: `12345`
                })
                .set(`Authorization`, `Bearer ${token}`);
            
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `The Email is Already in Use`);
        })

        test(`Failed 400, Invalid Email Format`, async () => {
            const response = await request(app)
                .post(`/add-user`)
                .send({ 
                    email: `mnaufaldillah`,
                    password: `12345`
                })
                .set(`Authorization`, `Bearer ${token}`);
            
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Invalid Email Format`);
        })

        test(`Failed 401, Unauthenticated No Token`, async () => {
            const response = await request(app)
                .post(`/add-user`)
                .send({ 
                    email: `mnaufaldillah@outlook.com`,
                    password: `12345`
                });
            
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Unauthenticated`);
        })

        test(`Failed 500, Inavlid Token`, async () => {
            const response = await request(app)
                .post(`/add-user`)
                .send({ 
                    email: `mnaufaldillah@outlook.com`,
                    password: `12345`
                })
                .set(`Authorization`, `Bearer ${token}ushvss`);
            
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `invalid signature`);
        })

        test(`Failed 403, Attempting Adding User By Staff Role`, async () => {
            const response = await request(app)
                .post(`/add-user`)
                .send({ 
                    email: `example@outlook.com`,
                    password: `12345`
                })
                .set(`Authorization`, `Bearer ${tokenStaff}`);
            
            // console.log(response.body, `<---------- response body`);

            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty(`message`, `Forbidden Action`);
        })
    })
})