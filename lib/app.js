/** @jsx React.DOM */
'use strict';
var React = require('react');
var BillPanelApp = require('./BillPanelApp');
var $ = require('jquery');

React.renderComponent(
  <BillPanelApp />,
  $('#content')[0]
);


