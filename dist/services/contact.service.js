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
    findAllInquiries: ()=>findAllInquiries,
    createInquiry: ()=>createInquiry,
    sendReply: ()=>sendReply,
    findReply: ()=>findReply
});
const _database = require("../database");
const _httpException = require("../exceptions/httpException");
const _nodemailer = _interopRequireDefault(require("nodemailer"));
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
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
async function findAllInquiries() {
    const allInquiries = await _database.DB.Contact.findAll();
    return allInquiries;
}
async function createInquiry(inquiryData) {
    const createInquiryData = await _database.DB.Contact.create(_objectSpread({}, inquiryData));
    return createInquiryData;
}
async function sendReply(inquiryId, inquiryReply) {
    const inquiry = await _database.DB.Contact.findByPk(inquiryId);
    if (!inquiry) throw new _httpException.HttpException(409, "Message doesn't exist");
    const transporter = _nodemailer.default.createTransport({
        service: 'Gmail',
        auth: {
            user: 'noreply@lotshouse.com',
            pass: 'ixyjpzseshzzzszm'
        }
    });
    await transporter.sendMail({
        from: 'from@gmail.com',
        to: inquiry.email,
        subject: 'Reply to Your Inquiry',
        html: `Hi ${inquiry.name}, <br><br>
    This is regarding your inquiry ${inquiry.subject}<br>
    ${inquiryReply}`
    });
    await _database.DB.Contact.update({
        reply: inquiryReply
    }, {
        where: {
            id: inquiryId
        }
    });
    return true;
}
async function findReply(inquiryId) {
    const inquiryReply = (await _database.DB.Contact.findOne({
        where: {
            id: inquiryId
        }
    })).reply;
    return inquiryReply;
}

//# sourceMappingURL=contact.service.js.map