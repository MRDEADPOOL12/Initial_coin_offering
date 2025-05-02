"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _bcrypt = _interopRequireDefault(require("bcrypt"));
const _sequelize = require("sequelize");
const _supertest = _interopRequireDefault(require("supertest"));
const _app = require("../app");
const _authRoute = require("../routes/auth.route");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
afterAll(async ()=>{
    await new Promise((resolve)=>setTimeout(()=>resolve(), 500));
});
describe('Testing Auth', ()=>{
    describe('[POST] /signup', ()=>{
        it('response should have the Create userData', async ()=>{
            const userData = {
                email: 'test@email.com',
                password: 'q1w2e3r4!'
            };
            const authRoute = new _authRoute.AuthRoute();
            const users = authRoute.authController.authService.users;
            users.findOne = jest.fn().mockReturnValue(null);
            users.create = jest.fn().mockReturnValue({
                id: 1,
                email: userData.email,
                password: await _bcrypt.default.hash(userData.password, 10)
            });
            _sequelize.Sequelize.authenticate = jest.fn();
            const app = new _app.App([
                authRoute
            ]);
            return (0, _supertest.default)(app.getServer()).post(`${authRoute.path}signup`).send(userData).expect(201);
        });
    });
    describe('[POST] /login', ()=>{
        it('response should have the Set-Cookie header with the Authorization token', async ()=>{
            const userData = {
                email: 'test@email.com',
                password: 'q1w2e3r4!'
            };
            const authRoute = new _authRoute.AuthRoute();
            const users = authRoute.authController.authService.users;
            users.findOne = jest.fn().mockReturnValue({
                id: 1,
                email: userData.email,
                password: await _bcrypt.default.hash(userData.password, 10)
            });
            _sequelize.Sequelize.authenticate = jest.fn();
            const app = new _app.App([
                authRoute
            ]);
            return (0, _supertest.default)(app.getServer()).post(`${authRoute.path}login`).send(userData).expect('Set-Cookie', /^Authorization=.+/);
        });
    });
});

//# sourceMappingURL=auth.test.js.map