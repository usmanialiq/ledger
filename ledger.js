const Ledger = require('express').Router();
const _ = require('underscore');


Ledger.get('/ledger', (req, res, next) => {
    
    let db = require('../db/connection');
    // Collections Required
    let cltColl = db.collection('clients');

    try {
        cltColl.find( (errClt, resClt) => {
            if(errClt) {
                console.log('Error at Clients Collection',errClt)
            }
            if(resClt.length >= 1) { 
                // Rendering View
                res.render('ledger', {
                    client: resClt,
                    creditedData: '',
                    status: '',
                    total: '',
                    ledgerFor: ''
                })
            }
            else if(resClt.length === 0) { 
                // Rendering View
                res.render('ledger', {
                    client: null,
                    creditedData: '',
                    status: '',
                    total: '',
                    ledgerFor: ''
                })
            }
        })
    }
    catch(error) {
        console.log(error);
        next(error);
    }
});

Ledger.post('/client/ledger', (req, res, next) => {
    let value = req.body.client_id;

    let db = require('../db/connection');
    // Collections Required
    let invColl = db.collection('invoices');
    let payColl = db.collection('payments');
    let cltColl = db.collection('clients');

    // Debit Data Prototype
    let debitProto = function(inv, id, dateOf, debit) {
        this.id = id;
        this.dateOf = dateOf;
        this.debit = debit;
        this.inv = inv;
    };
    // Credit Data Prototype
    let creditProto = function(pr_id, dateOf, c_name, credit, chq) {
        this.pr_id = pr_id;
        this.dateOf = dateOf;
        this.c_name = c_name;
        this.credit = credit;
        this.chq = chq;
    };

    // Working for Ledger Data
    let debitData = [], creditData = [];

    // Fetching DebitData
    invColl.find({"c_name": value}, (errInv, resInv) => {
        if(errInv) {
            console.log('Error at Invoices Collection', errInv);
        }
        for(let i = 0; i < resInv.length; i++) {
            let cID = resInv[i].c_name;
            let dateOfdebit = resInv[i].date;
            let tVal = resInv[i].total;
            let invSN = resInv[i].inv_no;
            debitData.push(new debitProto(invSN, cID, dateOfdebit, tVal));
        }

        // Sorting the Data according to Client's ID
        let sortByID = _.sortBy(debitData, 'id');

        let finalDebit = [];
        for(let j = 0; j < sortByID.length; j++) {
            if(sortByID[j].id === value) {
                finalDebit.push(sortByID[j]);
            }
        }

        // Fetching CreditData
        payColl.find({"client": value}, (errPay, resPay) => {
            if(errPay) {
                console.log('Error at Payments Collection', errPay);
            }    
            for (let i = 0; i < resPay.length; i++) {
                let pr = resPay[i].pmt_no;
                let dateOfcredit = resPay[i].date;
                let client = resPay[i].client;
                let db_amount = resPay[i].amount;
                let cheque = resPay[i].cheque_no;
                creditData.push(new creditProto(pr, dateOfcredit, client, db_amount, cheque));
            }           
            creditData = _.sortBy(creditData, 'c_name');

            let finalCredit = [];
            for(let j = 0; j < creditData.length; j++) {
                if(creditData[j].c_name === value) {
                    finalCredit.push(creditData[j]);
                }
            }

            let array = [] = finalDebit.concat(finalCredit);                                
            array = _.sortBy(array, 'dateOf');

            // Totaling Block
                let creditTotal = 0, debitTotal = 0, totalAmount, pluckCredit = [], pluckDebit = [];
                                    
                // Credit Total
                pluckCredit = _.pluck(array, 'credit');
                pluckCredit = pluckCredit.filter((e) => { return e !== undefined });
                pluckCredit.map( item => { 
                    creditTotal += +item;
                })

                // Debit Total
                pluckDebit = _.pluck(array, 'debit');  
                pluckDebit = pluckDebit.filter((e) => { return e !== undefined });
                pluckDebit.map( item => { 
                    debitTotal += +item;
                    
                });

                totalAmount = debitTotal - creditTotal;
                
                cltColl.find( (errClt, resClt) => {
                    if(errClt) {
                        console.log('Error at Clients Collection', errClt)
                    }
                
                    // Rendering View
                    res.render('ledger', {
                        client: resClt,
                        creditedData: array,
                        status: 'Debited by ',
                        total: totalAmount,
                        ledgerFor: 'Ledger for ' + value
                    })
                });

        });

    });

});


module.exports = Ledger;
