'use strict';

var moment = require('moment');

var Fluxxor = require('fluxxor');
var couch = require('couch-promise');
var options = require('../config');
var Q = require('q');
var R = require('ramda');

var shepperd = {
    login: function(user, password) {
        return function() {
            if (!options.user) {
                return Q.fcall(R.always(true));
            } else {
                return couch.login(user, password);
            }

        };

    },
    cascade: R.curry(function(onError /*, ...promisers*/ ) {
        var firstPromiser = arguments[1];
            var promisers = [].slice.call(arguments, 2);
        return function(){
            
            var chainPromises = R.reduce(function(promise, promiser) {
                return promise.then(promiser);
            }, firstPromiser());
            return chainPromises(promisers).then(null, onError);
        };
    }),
    get: R.curry(function(document, view, key) {
        return function() {
            return couch.get(document, view, key);
        };

    }),
    getOne: R.curry(function(document, view, key) {
        return function() {
            return couch.getOne(document, view, key);
        };

    })
};

var changeBillsData = R.curry(function(store, busy, ok, reason, bills) {
    store.data = {
        busy: busy,
        ok: ok,
        bills: bills || [],
        reason: reason
    };
    store.emit('change');
});

var login = shepperd.login(options.user, options.password);
var getFt = function(code) {
    return shepperd.getOne('billy', 'fattureByCode', '"' + code + '"');
};
var getList = shepperd.get('billy', 'list-totals', null);

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

        this.setBusy = changeBillsData(this, true, true, null);
        this.setResults = changeBillsData(this, false, true, null);
        this.setError = function(err) {
            return changeBillsData(this, false, false, err.message);
        };


    },

    onSetPayed: function(code) {
        var self = this;


        var findBillByCode = R.find(function(b) {
            return b.code === code;
        });
        var actualBill = findBillByCode(self.data.bills);

        function reloadData() {

            actualBill.pagata = true;
            self.emit('change');
            self.onRefreshData(false);
        }


        function saveFt(bill) {
            bill.pagata = true;
            return couch.update(bill);
        }

        couch.init(options);
        
        var loadData = shepperd.cascade(
            this.setError,
            login,
            getFt(code),
            saveFt,
            reloadData
        );

        
        loadData();
    },

    onRefreshData: function(changeBusyStatus) {

        var setState = R.pipe(
            R.each(function(bill) {
                bill.data = moment(bill.data, 'DD/MM/YYYY');
            }),

            this.setResults
        );

        couch.init(options);

        var loadData = shepperd.cascade(
            this.setError,
            login,
            getList,
            setState
        );

        var setBusyAndLoad = R.pipe(
            this.setBusy,
            loadData
        );

        
        if (changeBusyStatus) {
            setTimeout(setBusyAndLoad, 100);
        } else {
            loadData();
        }



    },

    getState: function() {
        return this.data;
    }
});
