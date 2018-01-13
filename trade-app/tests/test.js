import TraderTestSuit from './trader';

import QualificationTestSuit from './qualification';

import CompensationPlanTestSuit from './compensation-plan';

import QualificationCompensationTestSuit from './qualification-compensation';

import CompanyControllerTestSuit from './company';

import VirtualCurrencyTestSuit from './virtual-currency';

import ProductControllerTestSuit from './product';

async function test() {

    // Create Qualification
    let qualifications = await QualificationTestSuit.createQualification();
    console.log(">>>> qualifications", qualifications );
    
    //Create Compensation Plans
    let compensationPlans = await CompensationPlanTestSuit.createCompensationPlan();
    console.log(">>>> compensationPlans", compensationPlans );
    
    //Create Qualification Compensation
    let qualificationCompensation = await QualificationCompensationTestSuit.createQualificationCompensation();
    console.log(">>>> qualificationCompensation", qualificationCompensation );
    
    //Create Virtual Currency
    let virtualCurrency = await VirtualCurrencyTestSuit.createVirtualCurrency();
    console.log(">>>> virtualCurrency",virtualCurrency );
    
    //Create Company
    let companyList = await CompanyControllerTestSuit.createCompany();
    console.log(">>>> companyList", companyList );
    
    //Create Product
    let productList = await ProductControllerTestSuit.createProduct();
    console.log(">>>> productList", productList );

    //Create Users
    console.log(">>>>", await TraderTestSuit.createTraders() );

    //Make some users purchase
    
}

module.exports = test;