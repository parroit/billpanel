'use strict';
var React = require('react');
var BillPanelApp = require('./BillPanelApp');
var $ = require('jquery');


var app = exports.instance = new BillPanelApp(null);

React.renderComponent(
  app,
  $('#content')[0]
);


