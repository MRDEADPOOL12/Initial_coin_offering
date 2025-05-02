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
    genrateRandomNumber: ()=>genrateRandomNumber,
    generateOTP: ()=>generateOTP
});
function genrateRandomNumber() {
    return Math.floor(Math.random() * 999999).toString();
}
function generateOTP() {
    const length = 6;
    const digits = '0123456789';
    let otp = '';
    for(let i = 0; i < length; i++){
        const index = Math.floor(Math.random() * digits.length);
        otp += digits[index];
    }
    return otp;
}

//# sourceMappingURL=math.js.map