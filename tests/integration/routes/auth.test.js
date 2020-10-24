const { User } = require('../../../models/user');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('config');

describe('POST /', () => {
    let user;
    let password = '12345678';
    let server;

    beforeEach(async () => {
        server = require('../../../index');

        user = new User({
            name: "John Doe",
            email: "example@gmail.com",
            password: password
        });
        await user.hashPassword();
        await user.save();
    });

    afterEach(async () => {
        await User.deleteMany({});
        await server.close();
    });

    const exec = () => {
        return request(server)
            .post('/api/auth')
            .send({
                email: user.email,
                password: password
            });
    };

    it('should return 200 and web token for valid request', async () => {
        const res = await exec();

        const decoded = jwt.verify(res.text, config.get('jwtPrivateKey'));
        expect(decoded).toHaveProperty('isAdmin');
        expect(decoded).toHaveProperty('_id');

    
        expect(res.status).toBe(200);
    });

    it('should return 400 if email not found', async () => {
        user.email = 'example@yahoo.co.uk';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if password does not match', async () => {
        password = '01234567';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if email is not provided', async () => {
        user.email = null;

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if passowrd is not provided', async () => {
        password = null;

        const res = await exec();

        expect(res.status).toBe(400);
    });

});