'use strict';

var moment = require('moment');

var Fluxxor = require('fluxxor');
var couch = require('couch-promise');
var options = require('../config');

module.exports = Fluxxor.createStore({
    actions: {
        'REFRESH_DATA': 'onRefreshData'
    },

    initialize: function() {
        this.data = {
            busy: false,
            ok: true,
            bills: []
        };
    },

    changeBillsData: function (data){
    	this.data = data;
    	this.emit('change');
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

        }

        function handleFailure(err) {
            self.changeBillsData({
                busy: false,
                ok: false,
                reason: err
            });
        }

        if (changeBusyStatus) {
            setBusy();
        }

        couch.init(options);
        if (options.user && options.password) {
            login().then(getList)
                .then(setState)
                .then(null, handleFailure);
        } else {
            getList()
                .then(setState)
                .then(null, handleFailure);
        }


        
    },

    getState: function() {
        return this.data;
    }
});
