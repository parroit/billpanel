'use strict';

var util = require('util'),
    Q = require('q'),
    validator = require('validator');

function validateUser(user, authStorage, cb) {
    var promises = [],
        results = {
            errors: {

            }
        };

    if (!user || typeof user !== 'object' || util.isRegExp(user) || util.isArray(user)) {
        results.errors.globals = 'User should be an object!';
        return cb(results);
    }

    if (!user.username) {
        results.errors.username = 'Username should be specified';
    }

    if (!results.errors.username && !validator.isAlphanumeric(user.username)) {
        results.errors.username = 'Should contains only letters or numbers';
    }

    if (!results.errors.username && !validator.isLength(user.username, 3, 15)) {

        results.errors.username = 'Should be between 3 and 15 characters length';
    }

    if (!results.errors.username) {
        promises.push(
            authStorage.getUser(user.username)
            .then(function(user) {

                if (user !== null) {
                    results.errors.username = 'Username is already registered';
                }
                return true;
            })
        );
    }

    if (!user.email) {
        results.errors.email = 'Email should be specified';
    }

    if (!results.errors.email && !validator.isEmail(user.email)) {
        results.errors.email = 'Should be a valid e-mail address';
    }

    if (!results.errors.email) {
        promises.push(
            authStorage.getUserByEmail(user.email)
            .then(function(user) {


                if (user !== null) {
                    results.errors.email = 'Email is already registered';
                }
                return true;
            })
        );
    }

    if (!user.password) {
        results.errors.password = 'Password should be specified';
    }

    if (!results.errors.password && !validator.isLength(user.password, 6)) {
        results.errors.password = 'Should be at least 6 characters length';
    }

    if (!results.errors.password && user.password !== user.confirm_password) {
        results.errors.password = 'Should match "Confirm Password';
    }

    if (user.t_and_c !== '1') {
        results.errors.t_and_c = 'You must check \'I Agree';

    }


    function resolveValidation() {
        
        if (!Object.keys(results.errors).length) {
            delete results.errors;
        }
        cb(results);
    }

    if (promises.length) {
//        console.log('I Promise')
        Q.all(promises)
            .then(resolveValidation);

    } else {

        process.nextTick(resolveValidation);

    }




}

module.exports = validateUser;
