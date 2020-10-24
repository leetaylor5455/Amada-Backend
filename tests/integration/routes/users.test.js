let { User } = require('../../../models/userModel');
const request = require('supertest');

describe('GET /me', () => {    

    let token;
    let user;
    let server;

    beforeEach(async () => {
        server = require('../../../index');
        user = new User({
            name: "John Doe",
            email: "example@gmail.com",
            password: "12345678"
        });
        await user.save();

        token = user.generateAuthToken();
    }); 

    afterEach(async () => {
        await User.deleteMany({});
        await server.close();
    });

    const exec = () => {
        return request(server)
            .get('/api/users/me')
            .set('x-auth-token', token)
            .send({ user });
    };

    it('should return 200 and user document on valid request', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('_id');
    });

    it('should return 401 if token not provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 404 if user not provided', async () => {
        user = await User.deleteMany({});

        const res = await exec();

        expect(res.status).toBe(404);
    });
});

describe('POST /', () => {
    let user;
    let server;

    beforeEach(async () => {
        server = require('../../../index');
        user = {
            name: "John Doe",
            email: "example@gmail.com",
            password: "12345678"
        }
    });
    
    afterEach(async () => {
        await User.deleteMany({});
        await server.close();
    });

    const exec = () => {
        return request(server)
            .post('/api/users')
            .send({
                name: user.name,
                email: user.email,
                password: user.password
            });
    }

    it('should return 200 and user document on valid request', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('_id');
    });

    it('should return 400 if user already exists with email', async () => {
        await exec(); // save user

        const res = await exec(); // attempt to save same user

        expect(res.status).toBe(400);
    });

    it('should return 400 if email not provided', async () => {
        user.email = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if email is not an email address', async () => {
        user.email = 'exampleatgmaildotcom';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if name is less than 3 characters', async () => {
        user.name = 'aa';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if name is more than than 50 characters', async () => {
        user.name = new Array(52).join('a');

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return password is not provided', async () => {
        user.password = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });
});