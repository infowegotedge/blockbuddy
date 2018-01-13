import ProductHandler from '../handler/product.handler';

var faker = require("faker");

var moment = require('moment');

class ProductTestSuit {

    createProduct = async () => {

        var list = [], tmp = {};

        tmp = {
            productType: "STATIC",
            productSku: "ST-BKN-199",
            description: "BlockNotes 199",
            productName: "BlockNotes 199",
            productMeta: {
                additional: []
            },
            sellingPrice: 199,
            compensationWallet: [
                { currencyCode: "BKN", total: 199 }
            ],
            compensationPortfolio: [
                { companyCode: "TENTANIUM", total: 8 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "STATIC",
            productSku: "ST-BKN-599",
            description: "BlockNotes 599",
            productName: "BlockNotes 599",
            sellingPrice: 599,
            compensationWallet: [
                { currencyCode: "BKN", total: 599 }
            ],
            compensationPortfolio: [
                { companyCode: "TENTANIUM", total: 10 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "STATIC",
            productSku: "ST-BKN-999",
            description: "BlockNotes 999",
            productName: "BlockNotes 999",
            sellingPrice: 999,
            compensationWallet: [
                { currencyCode: "BKN", total: 999 }
            ],
            compensationPortfolio: [
                { companyCode: "TENTANIUM", total: 12 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "STATIC",
            productSku: "ST-BKN-2999",
            description: "BlockNotes 2999",
            productName: "BlockNotes 2999",
            sellingPrice: 2999,
            compensationWallet: [
                { currencyCode: "BKN", total: 2999 }
            ],
            compensationPortfolio: [
                { companyCode: "TENTANIUM", total: 40 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "STATIC",
            productSku: "ST-BKN-4999",
            description: "BlockNotes 4999",
            productName: "BlockNotes 4999",
            sellingPrice: 4999,
            compensationWallet: [
                { currencyCode: "BKN", total: 4999 }
            ],
            compensationPortfolio: [
                { companyCode: "TENTANIUM", total: 60 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "STATIC",
            productSku: "ST-BKN-19990",
            description: "BlockNotes 19990",
            productName: "BlockNotes 19990",
            sellingPrice: 19990,
            compensationWallet: [
                { currencyCode: "BKN", total: 19990 }
            ],
            compensationPortfolio: [
                { companyCode: "TENTANIUM", total: 325 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "STATIC",
            productSku: "ST-BKN-49990",
            description: "BlockNotes 49990",
            productName: "BlockNotes 49990",
            sellingPrice: 49990,
            compensationWallet: [
                { currencyCode: "BKN", total: 49990 }
            ],
            compensationPortfolio: [
                { companyCode: "TENTANIUM", total: 900 }
            ]
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        //
        // tmp = {
        //     productType: "STATIC",
        //     productSku: "STATIC-BKN-100099",
        //     description: "BlockNotes 100099",
        //     productName: "BlockNotes 100099",
        //     sellingPrice: 100099,
        //     compensationWallet: [
        //         { currencyCode: "BKN", total: 100099 },
        //         { currencyCode: "BV", total: 100000 }
        //     ]
        // };
        //
        // list.push( await ProductHandler.createNewProduct( tmp ) );
        // tmp = {
        //     productType: "STATIC",
        //     productSku: "STATIC-BKN-199-TEST",
        //     description: "BlockNotes 199-TEST",
        //     productName: "BlockNotes 199 Test DO NOT BUY",
        //     sellingPrice: 199,
        //     productMeta: {
        //         additional: [ faker.company.catchPhrase(), faker.company.catchPhrase(), faker.company.catchPhrase() ]
        //     },
        //     compensationWallet: [
        //         { currencyCode: "BKN", total: 50 },
        //         { currencyCode: "BV", total: 20 }
        //     ],
        //     compensationPortfolio: [
        //         { companyCode: "TENTANIUM", total: 100 },
        //         { companyCode: "VANGUARD", total: 200}
        //     ]
        // };
        //
        // list.push( await ProductHandler.createNewProduct( tmp ) );


        tmp = {
            productType: "SUBSCRIPTION",
            productSku: "SUB-EM-199",
            description: "199 Euro/month",
            productName: "199 Euro/month",
            sellingPrice: 199,
            productMeta: {
                additional: [" Get 210 BKN – 6.5% extra"]
            },
            isActive: false
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "SUBSCRIPTION",
            productSku: "SUB-EM-399",
            description: "399 Euro/month",
            productName: "399 Euro/month",
            sellingPrice: 399,
            productMeta: {
                additional: ["Get 440 BKN – 9.1% extra"]
            },
            isActive: false
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );

        tmp = {
            productType: "SUBSCRIPTION",
            productSku: "SUB-EM-999",
            description: "999 Euro/month",
            productName: "999 Euro/month",
            sellingPrice: 999,
            productMeta: {
                additional: ["Get 1 130 BKN – 11.6% extra"]
            },
            isActive: false
        };

        list.push( await ProductHandler.createNewProduct( tmp ) );


        tmp = {
            productType: "SUBSCRIPTION",
            productSku: "SUB-Free",
            description: " Free membership",
            productName: " Free membership",
            sellingPrice: 0,
            productMeta: {
                additional: [
                ]
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
            sellingPrice: 599,
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