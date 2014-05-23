/** @jsx React.DOM */

/*
 * billpanel
 * https://github.com//billpanel
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

var React = require('react');

exports.initialize = function() {
    React.renderComponent( 
        /* jshint ignore:start */
        < h1 > I am browserified < /h1>,
        /* jshint ignore:end */
        document.querySelector('#content')
    );
};

exports.initialize();