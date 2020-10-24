const { User } = require('../../../models/userModel');
const auth = require('../../../middleware/authMiddleware');
const mongoose = require('mongoose');

describe('auth middlware', () => {

    const mockResponse = function() {
        var statusValue = 0;

        var status = function(statusCode) {
            statusValue = statusCode;
            return this;
        }

        var send = function(message) {
            return this;
        }

        var returnStatus = function() {
            return statusValue;
        }

        return { status: status, send: send, returnStatus: returnStatus }
    };
    const next = jest.fn();
    let res;

    beforeEach(() => {
        res = mockResponse();
    });

    afterEach(() => {
        res = null;
    })

    it('should populate req.user with a payload of a valid JWT', () => {
        const user = { 
            _id: new mongoose.Types.ObjectId().toHexString(), 
            isAdmin: true 
        };
        const token = new User(user).generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        };

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });

    it('should return status 401 if no token passed', () => {
        const token = ''
        const req = {
            header: jest.fn().mockReturnValue(token)
        };

        auth(req, res, next);

        expect(res.returnStatus()).toBe(401);
    });

    it('should return status 400 if invalid token passed', () => {
        const token = 'abc'
        const req = {
            header: jest.fn().mockReturnValue(token)
        };

        auth(req, res, next);

        expect(res.returnStatus()).toBe(400);
    });
});