'use strict';

var chai = require('chai');
chai.expect();
var should = chai.should();

var  
    AuthStorage = require('../../lib/model/auth-storage'),
    validateUser = require('../../lib/model/auth/user-validator'),
    authStorage;



describe('AuthStorage', function() {
    before(function(done) {
        authStorage = new AuthStorage({
            file: __dirname + '/../config/test-users.json',
            onReady: done
        });
    });


    it('is defined', function() {

        validateUser.should.be.a('function');
    });

    it('return an object', function(done) {
        validateUser(null, null, function(result) {
            result.should.be.a('object');
            done();
        });

    });

    describe('Return globals error', function() {
        function checkValue(value) {
            return function(done) {
                validateUser(value, null, function(result) {
                    result.errors.globals.should.be.equal('User should be an object!');
                    done();
                });

            };
        }

        it('when user is a boolean', checkValue(true));
        it('when user is a number', checkValue(1));
        it('when user is a string', checkValue('ciao'));
        it('when user is null', checkValue(null));
        it('when user is undefined', checkValue(undefined));
        it('when user is an array', checkValue([]));
        it('when user is a RE', checkValue(/a/));
    });

    function checkField(field, value, expected) {
        return function(done) {
            var user = {};
            user[field] = value;
            validateUser(user, authStorage, function(result) {
                result.errors[field].should.be.equal(expected);
                done();
            });

        };
    }


    describe('username is not valid', function() {

        it(
            'when it is undefined',
            checkField('username', undefined, 'Username should be specified')
        );

        it(
            'when it is not alphanumeric',
            checkField('username', '..', 'Should contains only letters or numbers')
        );

        it(
            'when it is shorter than 3',
            checkField('username', 'aa', 'Should be between 3 and 15 characters length')
        );

        it(
            'when it is longer than 15',
            checkField('username', '01234567890abcdefXX', 'Should be between 3 and 15 characters length')
        );

        it(
            'when it is duplicate',
            checkField('username', 'parroit', 'Username is already registered')
        );


    });


    describe('email is not valid', function() {

        it(
            'when it is undefined',
            checkField('email', undefined, 'Email should be specified')
        );

        it(
            'when it is not email',

            checkField('email', 'aa', 'Should be a valid e-mail address')
        );

        it(
            'when it is duplicate',
            checkField('email', 'andrea.parodi@ebansoftware.net', 'Email is already registered')
        );

    });

    describe('password is not valid', function() {

        it(
            'when it is undefined',
            checkField('password', undefined, 'Password should be specified')
        );

        it(
            'when it is shorter than 6',

            checkField('password', 'aa', 'Should be at least 6 characters length')
        );

        it(
            'when it does\'nt match confirmation',

            checkField('password', 'aabbccdd', 'Should match "Confirm Password')
        );


    });

    describe('Term and condition is not valid', function() {

        it('when it is undefined',
            checkField('t_and_c', undefined, 'You must check \'I Agree')
        );

        it(
            'when it is different than 1',

            checkField('t_and_c', '0', 'You must check \'I Agree')
        );
    });

    describe('Well formed user', function() {
        var results;
        
        before(function(done) {
            var user = {
            	username: 'someOne',
            	password: 'Can you guess this?',
            	confirm_password: 'Can you guess this?',
            	email: 'andrea@parro.it',
            	t_and_c: '1'

            };
            validateUser(user, authStorage, function(result) {
                results = result;
                done();
            });
        });

        it('return object results', function() {
        	results.should.be.a('object');
        });

        it('errors are empty', function() {
        	should.equal(results.errors, undefined);
        });
    });
});
