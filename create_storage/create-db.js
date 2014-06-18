'use strict';

var couch = require('couch-promise'),
    design = require('./design');

function createDb() {
    console.log('Creating database');
    couch.createDb().then(function(res) {
        if (res.data.ok) {
            console.log('Couchdb database created.');
            couch.updateDesign(design, 'billy')
                .then(function(res) {

                    if (res.data.ok) {

                        console.log('Design updated successfully');
                    } else {
                        console.log('Cannot update design:%s', res.data.reason);
                    }

                }).then(null, function(err) {
                    console.log('Cannot update design:%s\n%s', err.message, err.stack);
                });
        } else {
            console.log('Cannot create database:%s', JSON.stringify(res));
        }


    }).then(null, function(err) {
        console.log('Cannot connect to couchdb:%s\n%s', err.message, err.stack);
    });
}





exports.create = function(uri, user, password) {
    couch.init({
        db: uri
    });

    console.log('Couchdb database ready.');

    function updateDesign() {

        return couch.updateDesign(design, 'billy')
            .then(function(res) {
                if (res.data.ok) {

                    console.log('Design updated successfully');
                } else {
                    console.log('Cannot update design:%s', res.data.reason);
                }

            }).then(null, function(err) {
                console.log('Cannot update design:%s\n%s', err.message, err.stack);
            });
    }

    function handleErrors(err) {

        if (err.statusCode === 404) {
            console.log('Database doesn\'t exist.');
            couch.login('parroit', 'minestra2014')
                .then(function() {
                    console.log('Login successfully.');
                    createDb();
                });
        } else {
            console.log('Cannot connect to couchdb:\n%s', err.message, err.stack);
        }

    }

    if (user && password) {
        return couch.login(user, password)
            .then(updateDesign)
            .then(null, handleErrors);    
    } else {
        return updateDesign()
            .then(null, handleErrors);    
    }
    
};
