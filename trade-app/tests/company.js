import CompanyHandler from '../handler/company.handler';

var faker = require("faker");

var moment = require('moment');

class CompanyTestSuit {

    createCompany = async () => {

        var list = [];
        let tmp = {
            companyCode: "SITV-WARRANT",
            companyName: "SITV Warrant",
            companyShortDescription: "This warrant gives the holder the option to buy 1 newly issued share in Stockholm IT Ventures AB for a fixed price of 0.01 Euro no later than December 31 2017.Stockholm IT Ventures AB is an IT holding company focused on next generation technologies already trending in today’s business world. Our current holdings focus on the decentralization and demonetization trend facing social media- where users creating the content that social media companies thrive on will actually participate in that revenue. While this trend is generally a new one in the marketplace that few companies actually see, we believe this trend will only increase and ultimately thrive in the next generation web. We believe our company is well positioned right now to take advantage of this trend. We also are planning on entering into the artificial intelligence space soon as we move forward as a company.",
            companyLongDescription: "<b>Wayne Lochner | Chairman of the Board</b><br/>Wayne is an experienced Entrepreneur across Finance, Technology, Telecoms, Gambling and Media. This experience has been through small, medium and large companies in most major financial centers, Stock market listed and unlisted, IPO and MBO, Acquisition and Disposal.1975 – 1990 Mercantile House Holdings. CEO Hatori Marshall Japan1990 -1995 MAI PLC . Chairman Asia Pacific Harlow/Ueda/Butler<br/>1995- 2002 Affinity Internet Holdings PLC Founder and CEO<br/>2003 – 2008 Betbrokers PLC Founder and Chairman<br/>2008 -2009 Advisor Centaur Sports Fund Management (Sports Gambling Fund)<br/>2008 to 2013 Director -CarbonAdvisoryGroupPLC. (Green technologies)<br/>2009 to 2013 – Sports Management Group Ltd.<br/>2008 to 2016 – Chairman Upad Ltd (online tenant and landlord matching)<br/>Current Directorships –<br/>2012 to Present co- Founder and Director – Fantrac Ltd.<br/>( Celebrity Social Media )<br/>2012 to Present Chairman SMS Ltd.<br/>( SMS SAAS solutions for Stadium owners and Bookmakers)<br/>2009 to Present Director – Ubitrac Ltd<br/>( Location Based Services)<br/>Awarded ‘London’s E-Business Entrepreneur of the Year’.<br/>President of the Royal Society of St. George, Tokyo and Yokohama, 1987/88.<br/>Appeal Board of the St. Barts Hospital ‘Cancer Centre of Excellence’<br/>for the three years which raised in excess of £13 million pounds towards the re-development of their Breast Cancer Centre of Excellence.2000/2003<br/>Appeal Board of the Natural History Museum raising £65 million for the new Darwin 2 Centre.2003/2006<br/>Appeal Board of the London City branch of Help the Aged – raising the profile of the Charity with the major institutions operating in the City of London.2005/2006<br/>Appeal Board Interim Chairman – Institute of Imagination – 2013 to Present.",
            companyAddress: "Stockholm | Sweden",
            companyURL: "www.stockholmit.co",
            companyEmail: "admin@stockholmit.co",
            companyContactNumber: "9999000011110",
            companyMeta: {}
        };

        list.push( await CompanyHandler.createCompany( tmp ) );

        tmp = {
            companyCode: "YAZZER-LIFESTYLE-AB",
            companyName: "Yazzer Lifestyle AB",
            companyShortDescription: "Yazzer NV is a Dutch public company dedicated to service its members and to provide the charter industry with improved value and professionalism. This valuable and necessary service comes with a modern, positive, healthy, and friendly attitude. Yazzer is a registered company in Holland, with offices in Palma and Stockholm.",
            companyLongDescription: "<b>About Yazzer</b><br/>Yazzer NV is a Dutch public company dedicated to service its members and to provide the charter industry with improved value and professionalism. This valuable and necessary service comes with a modern, positive, healthy, and friendly attitude. Yazzer is a registered company in Holland, with offices in Palma and Stockholm.<br/><b>Best Value Luxury Experiences</b><br/>Yazzer specializes in finding the best luxury items to the best possible price for our members. We know the market which means we can offer our members both amazing early-bird discounts as well as “last minute luxury”. We offer best-value experiences in yachting and private jets, which until now were reserved for celebrities and millionaires. We’ve all seen how the rich and famous travel in style on private jets or spend their vacations on stunning yachts around the world. Now its your turn.<br/><b>Loyalty Rewarded</b><br/>Yazzer is the next generation engaging and emotive club, based on a belief that members’ loyalty should be rewarded. We will reward you for helping us grow by recommending your Yazzer experiences to friends, colleagues and others that also may want to live a life less ordinary. The rollout of this lifestyle members club will begin in September.<br/>We made it simple. You can either choose a private or corporate membership. Both come with perks well beyond what an ordinary yacht club membership can offer. The membership fees enable us to take position on interesting items and negotiate – for our members’ benefit – the best possible prices.<br/><b>BUSINESS MODEL</b><br/>Yazzer is a scalable business, connecting members with “empty legs” in the jet and yacht charter industries. We are always in the market to find more items to offer our members. We offer our operators, yacht or jet owners, a complete business model that increases revenue and occupancy while adding value via a fully integrated marketing platform with customer recognition for all operators.<br/>Yazzer brings several parties together in a value chain relating to yachting and their operations. As many yacht owners learn the hard way, the costs and challenges of properly operating their yacht as more and more people discover the benefits of fractional ownership. It is our belief that Yazzer, along with ourpartners, provide a solution benefiting all parties.",
            companyAddress: "Stockholm | Sweden",
            companyURL: "http://www.yazzer.se",
            companyEmail: "henrik.osterberg@yazzer.net",
            companyContactNumber: "9999000011110",
            companyMeta: {
                contactPerson: [{
                    name: "Henrik Österberg",
                    rank: "Chief Operating Officer",
                    email: "henrik.osterberg@yazzer.net",
                    number: ""
                }]
            }
        };

        list.push( await CompanyHandler.createCompany( tmp ) );

        tmp = {
            companyCode: "BLOCK-EVOLUTION-NV",
            companyName: "Block Evolution NV",
            companyShortDescription: "Block Evolution is the network that introduced you to Block Buddy! This is your opportunity to take an ownership stake in the company you’re helping grow and being a part of everyday. Take advantage now!",
            companyLongDescription: "Block Evolution is the network that introduced you to Block Buddy! This is your opportunity to take an ownership stake in the company you’re helping grow and being a part of everyday. Take advantage now!",
            companyAddress: "Amsterdam | Netherlands, Block Evolution NV, Keizersgracht 62-64, AMSTERDAM, 1015 CS, Netherlands",
            companyURL: "http://www.blockevolution.com/",
            companyEmail: "martin@blockevolution.com",
            companyContactNumber: "31-20-5206831",
            companyMeta: {
                contactPerson: [
                    {
                        name: "Martin Bylsma",
                        rank: "Chief Operating Officer",
                        email: "martin@blockevolution.com",
                        number: ""
                    },
                    {
                        name: "Peter Jakobsson",
                        rank: "Network Director",
                        email: "peter@blockevolution.com",
                        number: ""
                    }
                ]
            }
        };

        list.push( await CompanyHandler.createCompany( tmp ) );

        tmp = {
            companyCode: "VANGUARD",
            companyName: "Vanguard",
            companyShortDescription: "The Vanguard coin is the core for putting shares on the BlockChain. The assets behind the Vanguard Platinum Coin are currently in Stockholm IT Ventures AB, a publicly listed company on the Deutsche Börse stock exchange in Frankfurt, Germany. (DAX:SVAB) The strategy of the Vanguard Platinum Coin is to give you ownership in multiple cutting edge tech businesses leveraging its value through the power of a publicly listed stock on a major exchange.",
            companyLongDescription: "The Vanguard coin is the core for putting shares on the BlockChain. The assets behind the Vanguard Platinum Coin are currently in Stockholm IT Ventures AB, a publicly listed company on the Deutsche Börse stock exchange in Frankfurt, Germany. (DAX:SVAB) The strategy of the Vanguard Platinum Coin is to give you ownership in multiple cutting edge tech businesses leveraging its value through the power of a publicly listed stock on a major exchange.",
            companyAddress: "",
            companyURL: "",
            companyEmail: "",
            companyContactNumber: ""
        };

        list.push( await CompanyHandler.createCompany( tmp ) );

        tmp = {
            companyCode: "TENTANIUM",
            companyName: "Tentanium",
            companyShortDescription: "With the Tentanium Coin, you get a stake directly in the BlockBuddy system and you get to leverage the benefits of the whole company’s efforts. 20% of overall income is distributed back to you passively, so you can sit back and enjoy the benefits for the long haul! Act now because this coin is available for a limited series as it's the first released coin in the BlockBuddy Ecosystem and as such, it won't be around for long so don't miss out!.",
            companyLongDescription: "With the Tentanium Coin, you get a stake directly in the BlockBuddy system and you get to leverage the benefits of the whole company’s efforts. 20% of overall income is distributed back to you passively, so you can sit back and enjoy the benefits for the long haul! Act now because this coin is available for a limited series as it's the first released coin in the BlockBuddy Ecosystem and as such, it won't be around for long so don't miss out!.",
            companyAddress: "",
            companyURL: "",
            companyEmail: "",
            companyContactNumber: ""
        };

        list.push( await CompanyHandler.createCompany( tmp ) );

        tmp = {
            companyCode: "DIGITEX",
            companyName: "Digitex",
            companyShortDescription: "The Digitex Coin is a digital currency index coin made up of a selection of some of the most powerful digital currencies out there (Bitcoin, Ethereum, LiteCoin, etc) as well as some of the latest and greatest coins and tokens that we hand select to be a part of the pool. The Coin is a representation of the pool value and naturally will fluctuate in value based on the currencies it represents. Consider the Digitex coin as your opportunity to own the foundation of the crypto currency revolution and also a chance to get involved on the ground floor with new coins before they gain mass appeal.",
            companyLongDescription: "The Digitex Coin is a digital currency index coin made up of a selection of some of the most powerful digital currencies out there (Bitcoin, Ethereum, LiteCoin, etc) as well as some of the latest and greatest coins and tokens that we hand select to be a part of the pool. The Coin is a representation of the pool value and naturally will fluctuate in value based on the currencies it represents. Consider the Digitex coin as your opportunity to own the foundation of the crypto currency revolution and also a chance to get involved on the ground floor with new coins before they gain mass appeal.",
            companyAddress: "",
            companyURL: "",
            companyEmail: "",
            companyContactNumber: ""
        };

        list.push( await CompanyHandler.createCompany( tmp ) );

        return list;

    }
}
export default new CompanyTestSuit();