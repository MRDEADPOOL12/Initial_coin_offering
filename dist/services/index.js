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
    AuthService: ()=>_authService,
    UserService: ()=>_usersService,
    ContactService: ()=>_contactService,
    WalletService: ()=>_walletService,
    InvestmentService: ()=>_investmentService,
    MetaService: ()=>_metaService,
    getReferrer: ()=>getReferrer
});
const _authService = _interopRequireWildcard(require("./auth.service"));
const _usersService = _interopRequireWildcard(require("./users.service"));
const _contactService = _interopRequireWildcard(require("./contact.service"));
const _walletService = _interopRequireWildcard(require("./wallet.service"));
const _investmentService = _interopRequireWildcard(require("./investment.service"));
const _metaService = _interopRequireWildcard(require("./meta.service"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function getReferrer(referralCode) {
    throw new Error('Function not implemented.');
}

//# sourceMappingURL=index.js.map