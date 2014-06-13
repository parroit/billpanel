'use strict';

var React = require('react');
var template = require('./built-templates/spinner');

var Spinner = React.createClass({
    render: function() {
        return template();
    }
});

module.exports = Spinner;