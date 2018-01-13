import TraderPortfolioHandler from "../handler/trader-portfolio.handler";

import TraderPortfolioLedgerHandler from '../handler/trader-portfolio-ledger.handler';

class TraderPortfolio {

    updateTraderPortfolio = async ( payload, transaction ) => {

        /** Strategy
         * # Update the trader portfolio Add or Subtract shares
         * # Update trader portfolio Ledger
         */

        let data = {
            traderID: payload.traderID,
            systemPortfolioLedgerID: payload.systemPortfolioLedgerID,
            total: payload.total,
            companyPayload: payload.companyPayload,
            companyID: payload.companyPayload.companyID,
            shareTrade: payload.shareTrade,
            transferType: payload.transferType,
            type: payload.type,
            subType: payload.subType,
            note: payload.note,
            privateNote: payload.privateNote
        };

        let traderWalletLedger = null, traderPortfolio = null;

        if ( data.transferType == "CREDIT" ) {

            traderPortfolio = await TraderPortfolioHandler.addSharesToTraderPortfolio(
                data.traderID,
                data.companyPayload,
                data.total,
                transaction
            );

            traderWalletLedger = await TraderPortfolioLedgerHandler.createTraderPortfolioLedger(
                {
                    shareTrade: data.shareTrade,
                    total: data.total,
                    from: data.systemPortfolioLedgerID,
                    to: data.traderID,
                    transferType: data.transferType,
                    type: data.type,
                    subType: data.subType,
                    note: data.note,
                    privateNote: data.privateNote,
                    companyID: data.companyID
                },
                transaction
            );
        }

        if ( data.transferType == "DEBIT" ) {

            traderPortfolio = await TraderPortfolioHandler.addSharesToTraderPortfolio(
                data.traderID,
                data.companyPayload,
                data.totalShares,
                transaction
            );

            traderWalletLedger = await TraderPortfolioLedgerHandler.createTraderPortfolioLedger(
                {
                    shareTrade: data.shareTrade,
                    total: data.total,
                    to: data.systemPortfolioLedgerID,
                    from: data.traderID,
                    transferType: data.transferType,
                    type: data.type,
                    subType: data.subType,
                    note: data.note,
                    privateNote: data.privateNote,
                    companyID: data.companyID
                },
                transaction
            );
        }

        return traderWalletLedger

    }

}


export default new TraderPortfolio();
