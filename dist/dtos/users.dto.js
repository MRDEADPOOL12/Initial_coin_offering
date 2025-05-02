"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    CreateUserDto: ()=>CreateUserDto,
    LoginUserDto: ()=>LoginUserDto,
    VerifyLoginUserDto: ()=>VerifyLoginUserDto,
    VerifySignUpUserDto: ()=>VerifySignUpUserDto,
    UpdateUserDto: ()=>UpdateUserDto
});
const _classValidator = require("class-validator");
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
var __decorate = (void 0) && (void 0).__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (void 0) && (void 0).__metadata || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let CreateUserDto = class CreateUserDto {
    constructor(){
        _defineProperty(this, "email", void 0);
        _defineProperty(this, "password", void 0);
        _defineProperty(this, "phone", void 0);
        _defineProperty(this, "referralCode", void 0);
        _defineProperty(this, "referrerId", void 0);
    }
};
__decorate([
    (0, _classValidator.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, _classValidator.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, _classValidator.IsEmpty)(),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "referrerId", void 0);
let LoginUserDto = class LoginUserDto {
    constructor(){
        _defineProperty(this, "email", void 0);
        _defineProperty(this, "password", void 0);
    }
};
__decorate([
    (0, _classValidator.IsEmail)(),
    __metadata("design:type", String)
], LoginUserDto.prototype, "email", void 0);
let VerifyLoginUserDto = class VerifyLoginUserDto {
    constructor(){
        _defineProperty(this, "email", void 0);
        _defineProperty(this, "otp", void 0);
    }
};
__decorate([
    (0, _classValidator.IsEmail)(),
    __metadata("design:type", String)
], VerifyLoginUserDto.prototype, "email", void 0);
__decorate([
    (0, _classValidator.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyLoginUserDto.prototype, "otp", void 0);
let VerifySignUpUserDto = class VerifySignUpUserDto {
    constructor(){
        _defineProperty(this, "email", void 0);
        _defineProperty(this, "otp", void 0);
    }
};
__decorate([
    (0, _classValidator.IsEmail)(),
    __metadata("design:type", String)
], VerifySignUpUserDto.prototype, "email", void 0);
__decorate([
    (0, _classValidator.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifySignUpUserDto.prototype, "otp", void 0);
let UpdateUserDto = class UpdateUserDto {
    constructor(){
        _defineProperty(this, "password", void 0);
    }
};
__decorate([
    (0, _classValidator.IsString)(),
    (0, _classValidator.IsNotEmpty)(),
    (0, _classValidator.MinLength)(9),
    (0, _classValidator.MaxLength)(32),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);

//# sourceMappingURL=users.dto.js.map