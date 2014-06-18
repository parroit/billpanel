'use strict';

var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var setPayedTemplate = require('./built-templates/set-payed-btn');



module.exports = React.createClass({
    mixins: [FluxMixin],

    handleClick: function() {

        var code = this.props.code;
        var flux = this.getFlux();

        flux.actions.setBillPayed(code);
    },

    render: function() {
        return setPayedTemplate({
            handleClick: this.handleClick
        });
    }
});
