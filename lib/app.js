'use strict';
var Fluxxor = require('fluxxor');
var React = require('react');
var BillPanelApp = require('./BillPanelApp');
var $ = require('jquery');

var TotalsStore = require('./stores/billTotals');
var actions = {
  refreshData: function(changeBusyStatus) {
    this.dispatch('REFRESH_DATA', changeBusyStatus);
  },

};

var stores = {
  TotalsStore: new TotalsStore()
};

var flux = new Fluxxor.Flux(stores, actions);

var app = exports.instance = new BillPanelApp({flux:flux});



React.renderComponent(
  app,
  $('#content')[0]
);


