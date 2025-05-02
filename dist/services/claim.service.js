"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createInvestment", {
    enumerable: true,
    get: ()=>createInvestment
});
const _investmentModel = require("../models/investment.model");
const createInvestment = async (investmentData)=>{
    try {
        const investment = await _investmentModel.InvestmentModel.create(investmentData);
        return investment;
    } catch (error) {
        throw new Error('Error creating investment');
    }
};

//# sourceMappingURL=claim.service.js.map