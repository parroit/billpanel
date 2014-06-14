'use strict';

var React = require('react');
var setPayedTemplate = require('./built-templates/set-payed-btn');
var options = require('./config');
var couch = require('couch-promise');
var app = require('./app');


module.exports = React.createClass({
    handleClick: function() {
        
        var code = this.props.code;

        function login() {

            return couch.login(options.user, options.password);
        }

        function getFt() {
            return couch.getOne('billy', 'fattureByCode', '"' + code + '"');
        }

         function reloadData() {
            app.instance.loadBills();
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

    render: function() {
        return setPayedTemplate({
        	handleClick: this.handleClick
        });
    }
});
