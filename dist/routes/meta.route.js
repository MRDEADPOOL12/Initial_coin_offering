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
const _controllers = require("../controllers");
const path = '/meta';
const router = (0, _express.Router)();
router.get(`${path}/analytics`, _controllers.MetaController.getMetaForAnalytics);
router.get(`${path}/analytics/user/:id(\\d+)`, _controllers.MetaController.getMetaForUserAnalyticsByID);
const MetaRouter = {
    path: path,
    router: router
};
const _default = MetaRouter;

//# sourceMappingURL=meta.route.js.map