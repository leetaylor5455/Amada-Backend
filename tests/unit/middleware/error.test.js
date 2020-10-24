const errorMiddleware = require('../../../middleware/error');
const mongoose = require('mongoose');

describe('error middlware', () => {

    const Log = mongoose.model('Log', new mongoose.Schema({
        timestamp: String,
        level: String,
        message: String,
        meta: String
    }, 
    { collection: 'log' }));

    // Spin up DB to log error message
    // beforeAll(() => {
    //     require('../../../startup/db')();
    // });
    // Delete logs and close DB connection
    // afterAll(async () => {
    //     await Log.deleteMany({})
    //     await mongoose.connection.close();
    // });

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
    const res = mockResponse();
    const req = {};
    const next = jest.fn();

    it('should return status 500 on error', () => {
        errorMiddleware(new Error('Test error.'), req, res, next);

        expect(res.returnStatus()).toBe(500);
    });
});