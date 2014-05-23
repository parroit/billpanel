/** @jsx React.DOM */
var React = require('react');

exports.initialize = function() {
    'use strict';
    React.renderComponent( 
        /* jshint ignore:start */
        <article>
        < h2 > Hello, I am a react page.</h2>
        <h3> I browserify as you change me </h3>
        </article>
        ,
        /* jshint ignore:end */
        document.querySelector('#content')
    );
};
