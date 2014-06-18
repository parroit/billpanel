'use strict';

var moment = require('moment');

var Fluxxor = require('fluxxor');
var couch = require('couch-promise');
var options = require('../config');
var Q = require('q');
var R = require('ramda');

module.exports = Fluxxor.createStore({
    actions: {
        'REFRESH_DATA': 'onRefreshData',
        'SET_BILL_PAYED': 'onSetPayed'
    },

    initialize: function() {
        this.data = {
            busy: false,
            ok: true,
            bills: []
        };
    },

    changeBillsData: function(data) {
        this.data = data;
        this.emit('change');
    },

    onSetPayed: function(code){
        var self = this;

        function login() {
            if (!options.user) {
                return Q.fcall(R.always(true));
            }
            return couch.login(options.user, options.password);
        }

        function getFt() {
            return couch.getOne('billy', 'fattureByCode', '"' + code + '"');
        }

         function reloadData() {
            var actualBill = self.data.bills.filter(function(b){return b.formattedCode === code;})[0];
            actualBill.pagata = true;
            self.emit('change');
            self.onRefreshData(false);
        }

        function handleFailure(err) {
            console.error(err);
        }

        function saveFt(bill) {
            bill.pagata = true;
            return couch.update(bill);
        }
        couch.init(options);
        login().then(getFt)
            .then(saveFt)
            .then(reloadData)
            .then(null, handleFailure);
    },

    onRefreshData: function(changeBusyStatus) {
        var self = this;

        function login() {
            return couch.login(options.user, options.password);
        }

        function getList() {
            return couch.get('billy', 'list-totals');
        }

        function setState(bills) {
            bills.forEach(function(bill) {
                bill.data = moment(bill.data, 'DD/MM/YYYY');
            });

            self.changeBillsData({
                busy: false,
                ok: true,
                bills: bills
            });
        }


        function setBusy() {

            self.changeBillsData({
                busy: true,
                ok: true,
                bills: []
            });

            loadData();

        }

        function handleFailure(err) {
            self.changeBillsData({
                busy: false,
                ok: false,
                reason: err.message
            });
        }

   

        function loadData() {
            couch.init(options);
            if (options.user && options.password) {
                return login()
                    .then(getList)
                    .then(setState)
                    .then(null, handleFailure);
            } else {
                return getList()
                    .then(setState)
                    .then(null, handleFailure);
            }
        }

         if ( changeBusyStatus) {
            setTimeout(setBusy,100);
        } else {
            loadData();
        }



    },

    getState: function() {
        return this.data;
    }
});
