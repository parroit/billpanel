'use strict';

var chai = require('chai');
chai.expect();
var should = chai.should();

var initData = require('./init-db-data'),

    app = require('../../../lib/model/bills-storage');


app.init({
    couch: {
        db: 'http://localhost:5984/billy-test'
    }
});
describe('clienti', function() {
    before(function(done) {
        initData(done);
    });

    it('is defined', function() {
        app.clienti.should.be.an('object');
    });
    describe('all', function() {
        var customers;
        before(function(done) {
            app.clienti.all().then(
                function success(result) {
                    customers = result;
                    done();
                }, function fail(err) {
                    throw err;
                }
            );
        });
        it('is defined', function() {
            app.clienti.all.should.be.an('function');
        });

        it('return all customers', function() {
            customers.should.be.an('array');
            console.dir(customers);
            customers.length.should.be.equal(1);
            customers[0].partitaIva.should.be.equal('01513860997');
        });

        it('returned customers has id', function() {
            customers[0]._id.should.be.a('string');

        });

        it('returned customers has revision', function() {
            customers[0]._rev.should.be.a('string');

        });
    });

    var customer;

    function loadOne(code, done) {
        app.clienti.byCode(code).then(
            function success(result) {
                customer = result;
                done();
            }, function fail(err) {

                console.log(err);
                throw err;
            }
        );
    }

    var deleteResult;

    function deleteAndRetrieve(code, done) {

        app.clienti.delete(code).then(
            function success(result) {
                deleteResult = result;
                app.clienti.byCode(code).then(
                    function success(result2) {
                        customer = result2;
                        done();
                    }, function fail(err) {

                        console.log(err);
                        throw err;
                    }
                );
            }, function fail(err) {

                console.log('DELETE:', err);
                done();
            }
        );
    }

    function saveAndRetrieve(code, document, done) {
        app.clienti.save(document).then(
            function success(result) {
                console.log(result);
                app.clienti.byCode(code).then(
                    function success(result2) {
                        customer = result2;
                        done();
                    }, function fail(err) {

                        //console.log(err);
                        throw err;
                    }
                );

            }, function fail(err) {

                //console.log(err);
                throw err;
            }
        );
    }

    describe('byCode', function() {
        it('is defined', function() {
            app.clienti.byCode.should.be.an('function');
        });


        describe(' of existing document', function() {
            before(function(done) {
                loadOne('01513860997', done);
            });


            it('return single customer by code', function() {
                customer.should.be.an('object');

                customer.codiceFiscale.should.be.equal('01513860997');
            });

            it('returned customer has id', function() {
                customer._id.should.be.a('string');

            });
            it('returned customer has type', function() {
                customer.type.should.be.equal('cliente');

            });
            it('returned customer has revision', function() {
                customer._rev.should.be.a('string');

            });
        });

        describe(' of unknown document', function() {
            before(function(done) {
                loadOne('bad code', done);
            });


            it('return null', function() {
                customer.should.be.equal(null);


            });

        });


    });




    describe('create', function() {

        before(function(done) {
            deleteAndRetrieve('vattelapesca', function() {
                var customer2 = {
                    codiceFiscale: 'vattelapesca',
                    descrizione: 'cliente',
                    type: 'cliente'
                };

                saveAndRetrieve('vattelapesca', customer2, done);

            });


        });


        it('update document', function() {
            customer.descrizione.should.be.equal('cliente');
            customer.codiceFiscale.should.be.equal('vattelapesca');
            customer._id.should.be.a('string');

        });


    });

    describe('save', function() {
        var original;

        before(function(done) {
            original = customer.descrizione;
            var customer2 = customer;
            customer = null;
            customer2.descrizione = customer2.descrizione + '*';

            saveAndRetrieve('vattelapesca', customer2, done);


        });
        it('is defined', function() {
            app.clienti.save.should.be.an('function');
        });

        it('update document', function() {
            customer.descrizione.should.be.equal(original + '*');

        });


    });

    describe('delete', function() {
        before(function(done) {
            deleteAndRetrieve('vattelapesca', done);
        });

        it('remove document', function() {
            should.equal(customer, null);

        });

    });
});
