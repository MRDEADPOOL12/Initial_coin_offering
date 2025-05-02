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
    path: ()=>path,
    router: ()=>router,
    default: ()=>_default
});
const _express = require("express");
const path = '/contactus';
const router = (0, _express.Router)();
const ContactRouter = {
    path: path,
    router: router
};
const _default = ContactRouter;

//# sourceMappingURL=contact.route.js.map