"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createclaimDto", {
    enumerable: true,
    get: ()=>createclaimDto
});
const _cloudfront = require("aws-sdk/clients/cloudfront");
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
let createclaimDto = class createclaimDto {
    constructor(){
        _defineProperty(this, "walletAddress", void 0);
        _defineProperty(this, "txnHash", void 0);
        _defineProperty(this, "email", void 0);
    }
};
__decorate([
    (0, _classValidator.IsString)(),
    (0, _classValidator.IsNotEmpty)(),
    __metadata("design:type", String)
], createclaimDto.prototype, "walletAddress", void 0);
__decorate([
    (0, _classValidator.IsString)(),
    (0, _classValidator.IsNotEmpty)(),
    __metadata("design:type", typeof _cloudfront.integer === "undefined" ? Object : _cloudfront.integer)
], createclaimDto.prototype, "txnHash", void 0);
__decorate([
    (0, _classValidator.IsNotEmpty)(),
    __metadata("design:type", String)
], createclaimDto.prototype, "email", void 0);

//# sourceMappingURL=claim.dto.js.map