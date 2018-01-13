import ProductHandler from '../handler/product.handler';

var faker = require("faker");

var moment = require('moment');

class ProductTestSuit {

    createProduct = async () => {

        var list = [];

        let tmp = {
            productType: "STATIC",
            productSku: "STATIC-BKN-199",
            description: "BlockNotes 199",
            productName: "BlockNotes 199",
            productMeta: {
                additional: []
            },
            sellingPrice: 199,
            compensationWallet: [
                { currencyCode: "BKN", total: 199 },
                { currencyCode: "BV", total: 100 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "STATIC",
            productSku: "STATIC-BKN-599",
            description: "BlockNotes 599",
            productName: "BlockNotes 599",
            sellingPrice: 599,
            compensationWallet: [
                { currencyCode: "BKN", total: 599 },
                { currencyCode: "BV", total: 500 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "STATIC",
            productSku: "STATIC-BKN-1099",
            description: "BlockNotes 1099",
            productName: "BlockNotes 1099",
            sellingPrice: 1099,
            compensationWallet: [
                { currencyCode: "BKN", total: 1099 },
                { currencyCode: "BV", total: 1000 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "STATIC",
            productSku: "STATIC-BKN-5099",
            description: "BlockNotes 5099",
            productName: "BlockNotes 5099",
            sellingPrice: 5099,
            compensationWallet: [
                { currencyCode: "BKN", total: 5099 },
                { currencyCode: "BV", total: 5000 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "STATIC",
            productSku: "STATIC-BKN-10099",
            description: "BlockNotes 10099",
            productName: "BlockNotes 10099",
            sellingPrice: 10099,
            compensationWallet: [
                { currencyCode: "BKN", total: 10099 },
                { currencyCode: "BV", total: 10000 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "STATIC",
            productSku: "STATIC-BKN-20099",
            description: "BlockNotes 20099",
            productName: "BlockNotes 20099",
            sellingPrice: 20099,
            compensationWallet: [
                { currencyCode: "BKN", total: 20099 },
                { currencyCode: "BV", total: 20000 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "STATIC",
            productSku: "STATIC-BKN-50099",
            description: "BlockNotes 50099",
            productName: "BlockNotes 50099",
            sellingPrice: 50099,
            compensationWallet: [
                { currencyCode: "BKN", total: 50099 },
                { currencyCode: "BV", total: 50099 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );


        tmp = {
            productType: "STATIC",
            productSku: "STATIC-BKN-100099",
            description: "BlockNotes 100099",
            productName: "BlockNotes 100099",
            sellingPrice: 100099,
            compensationWallet: [
                { currencyCode: "BKN", total: 100099 },
                { currencyCode: "BV", total: 100000 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "STATIC",
            productSku: "STATIC-BKN-199-TEST",
            description: "BlockNotes 199-TEST",
            productName: "BlockNotes 199 Test DO NOT BUY",
            sellingPrice: 199,
            productMeta: {
                additional: [ faker.company.catchPhrase(), faker.company.catchPhrase(), faker.company.catchPhrase() ]
            },
            compensationWallet: [
                { currencyCode: "BKN", total: 100099 },
                { currencyCode: "BV", total: 100000 }
            ],
            compensationPortfolio: [
                { companyCode: "SITV-WARRANT", total: 99 },
                { companyCode: "BLOCK-EVOLUTION-NV", total: 20 },
                { companyCode: "VANGUARD", total: 200}
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );


        tmp = {
            productType: "SUBSCRIPTION",
            productSku: "SUB-FREE",
            description: "Free Membership",
            productName: "Free Membership",
            sellingPrice: 0,
            productMeta: {
                additional: []
            },
            isActive: false
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );


        tmp = {
            productType: "SUBSCRIPTION",
            productSku: "SUB-AFF",
            description: "Affiliate Membership",
            productName: "Affiliate Membership",
            sellingPrice: 9,
            productMeta: {
                additional: [
                    "Receive affiliate commissions"
                ]
            },
            isActive: false
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );


        tmp = {
            productType: "SUBSCRIPTION",
            productSku: "SUB-PREMIUM",
            description: "Premium Membership",
            productName: "Premium Membership",
            sellingPrice: 49,
            productMeta: {
                additional: [
                    "Receive affiliate commissions",
                    "Receive coins from Index buying",
                    "Receive 20% of your points in monthly shares in Block Evolution shares"
                ]
            },
            isActive: false
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );


        tmp = {
            productType: "SUBSCRIPTION",
            productSku: "SUB-PREMIUM-PLUS",
            description: "Premium Plus Membership",
            productName: "Premium Plus Membership",
            sellingPrice: 199,
            productMeta: {
                additional: [
                    "Receive affiliate commissions",
                    "Receive coins from Index buying",
                    "Receive 20% of your points in monthly shares in Block Evolution shares",
                    "Receive coins from the Social Commerce pool",
                    "Receive 50% of your points in monthly shares in Block Evolution shares"
                ]
            },
            isActive: false
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );


        tmp = {
            productType: "SUBSCRIPTION",
            productSku: "SUB-HIGH-ROLLER",
            description: "High Roller Membership",
            productName: "High Roller Membership",
            sellingPrice: 199,
            productMeta: {
                additional: [
                    "Receive affiliate commissions",
                    "Includes Yazzer membership including jet and yacht points",
                    "Receive coins from Index buying – can convert into points in Yazzer",
                    "Receive coins from the Social Commerce pool – can convert to points in Yazzer",
                    "Receive 100% of your points in monthly shares in Block Evolution shares"
                ]
            },
            isActive: false
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );


        return list;

    }
}
export default new ProductTestSuit();