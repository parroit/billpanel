'use strict';

var moment = require('moment');

var React = require('react');
var couch = require('couch-promise');
var options = require('./config');

var template = require('./built-templates/billpanel-app');

var BillPanelApp = React.createClass({
    componentWillMount: function() {
        var self = this;

        function login() {
            return couch.login(options.user, options.password);
        }

        function getList() {
            return couch.get('list-totals', 'list-totals');
        }

        function setState(bills) {
            bills.forEach(function(bill) {
                bill.data = moment(bill.data, 'DD/MM/YYYY');
            });

            self.setState({
                busy: false,
                ok: true,
                bills: bills
            });
        }


        function setBusy() {
            self.setState({
                busy: true,
                ok: true,
                bills: []
            });
        }

        function handleFailure(err) {
            self.setState({
                busy: false,
                ok: false,
                reason: err
            });
        }

        setBusy();


        couch.init(options);
        login().then(getList)
            .then(setState)
            .then(null, handleFailure);


    },


    getInitialState: function() {
        return {
            busy: false,
            ok: true,
            bills: []
        };
    },


    render: function() {
        return template({
            busy: this.state.busy,
            bills: this.state.bills
        });

    }
});

module.exports = BillPanelApp;
