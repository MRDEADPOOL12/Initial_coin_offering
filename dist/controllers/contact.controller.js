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
    getAllInquiries: ()=>getAllInquiries,
    createInquiry: ()=>createInquiry,
    sendReply: ()=>sendReply,
    getReply: ()=>getReply
});
const _services = require("../services");
const getAllInquiries = async (req, res, next)=>{
    try {
        const findAllInquiriesData = await _services.ContactService.findAllInquiries();
        res.status(200).json({
            data: findAllInquiriesData,
            message: 'findAll'
        });
    } catch (error) {
        next(error);
    }
};
const createInquiry = async (req, res, next)=>{
    try {
        const inquiryData = req.body;
        const createInquiryData = await _services.ContactService.createInquiry(inquiryData);
        res.status(201).json({
            data: createInquiryData,
            message: 'created'
        });
    } catch (error) {
        next(error);
    }
};
const sendReply = async (req, res, next)=>{
    try {
        const inquiryId = Number(req.params.id);
        const inquiryReply = req.body.reply;
        const updateReplyData = await _services.ContactService.sendReply(inquiryId, inquiryReply);
        res.status(201).json({
            data: updateReplyData,
            message: 'sent reply'
        });
    } catch (error) {
        next(error);
    }
};
const getReply = async (req, res, next)=>{
    try {
        const inquiryId = Number(req.params.id);
        const findInquiryReply = await _services.ContactService.findReply(inquiryId);
        res.status(200).json({
            data: findInquiryReply,
            message: 'findReply'
        });
    } catch (error) {
        next(error);
    }
};

//# sourceMappingURL=contact.controller.js.map