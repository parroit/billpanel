'use strict';
var React = require('react');
var BillPanelApp = require('./BillPanelApp');
var $ = require('jquery');

React.renderComponent(
  new BillPanelApp(null),
  $('#content')[0]
);


