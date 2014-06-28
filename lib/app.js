'use strict';
var Fluxxor = require('fluxxor');
var React = require('react');
var BillPanelApp = require('./BillPanelApp');
var $ = require('jquery');

var TotalsStore = require('./stores/billTotals');
var ChartDataStore = require('./stores/chartData');
var actions = {
  refreshData: function(changeBusyStatus) {
    this.dispatch('REFRESH_DATA', changeBusyStatus);
  },
  setBillPayed: function(code) {
    this.dispatch('SET_BILL_PAYED', code);
  },

};

var stores = {
  TotalsStore: new TotalsStore(),
  ChartDataStore: new ChartDataStore()
};

var flux = new Fluxxor.Flux(stores, actions);
var app = new BillPanelApp({flux:flux});



React.renderComponent(
  app,
  $('#content')[0]
);


