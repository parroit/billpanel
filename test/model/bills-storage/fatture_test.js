'use strict';

var chai = require('chai');
chai.expect();
var should = chai.should();

var initData = require('./init-db-data'),

    app = require('../../../lib/model/bills-storage');

app.init({
    couch: { db: 'http://localhost:5984/billy-test' }
});
describe('fatture', function() {
    before(function(done) {
        initData(done);
    });

    it('is defined', function() {
        app.fatture.should.be.an('object');
    });

    describe('byYear', function() {
        var bills;

        before(function(done) {
            app.fatture.byYear(new Date().getFullYear()).then(
                function success(result) {
                    bills = result;
                    //console.dir(bills);
                    done();
                }, done
            );
        });

        it('is defined', function() {
            app.fatture.byYear.should.be.an('function');
        });

        it('return all bills of year', function() {
            bills.should.be.an('array');
            bills.length.should.be.equal(1);
            bills[0].anno.should.be.equal(new Date().getFullYear());
        });

        it('returned bills has id', function() {
            bills[0]._id.should.be.a('string');

        });

        it('returned bills has revision', function() {
            bills[0]._rev.should.be.a('string');

        });

        it('returned bills has cliente', function() {
            bills[0].cliente.should.be.a('string');
            bills[0].cliente.should.be.equal('ZSis di Sergio Russo');

        });
    });


    var bill;

    function loadOne(code, done) {
        app.fatture.byCode(code).then(
            function success(result) {
                bill = result;
                done();
            }, done
        );
    }

    var deleteResult;

    function deleteAndRetrieve(code, done) {
        function retrieve() {
            app.fatture.byCode(code).then(
                function success(result2) {
                    bill = result2;
                    done();
                },
                done

            );
        }

        app.fatture.delete(code).then(
            function success(result) {
                deleteResult = result;
                retrieve();
            }
        ).then(null, function fail(err) {

            console.log(err);
            retrieve();
        });
    }

    function saveAndRetrieve(code, document, done) {
        //        console.log('CODE:%s',code);
        //        console.log('DOCUMENT CODE:%s',document.formattedCode);
        app.fatture.save(document).then(
            function success() {

                app.fatture.byCode(code).then(
                    function success(result2) {
                        //console.log(result2);
                        bill = result2;
                        done();
                    },
                    done
                );

            },
            done
        );
    }

    describe('byCode', function() {
        it('is defined', function() {
            app.fatture.byCode.should.be.an('function');
        });


        describe(' of existing document', function() {
            before(function(done) {
                loadOne('0001/2008', done);
            });


            it('return single bill by code', function() {
                bill.should.be.an('object');
                bill.formattedCode.should.be.equal('0001/2008');

            });

            it('returned bill has id', function() {
                bill._id.should.be.a('string');

            });

            it('returned bill has type', function() {
                bill.type.should.be.equal('fattura');

            });


            it('returned bill has revision', function() {
                bill._rev.should.be.a('string');

            });
        });

        describe(' of unknown document', function() {
            before(function(done) {
                loadOne('bad code', done);
            });


            it('return null', function() {
                should.equal(bill,null);


            });

        });


    });


    describe('create', function() {

        before(function(done) {
            deleteAndRetrieve('1002/2080', function() {
                var bill2 = {
                    formattedCode: '1002/2080',
                    description: 'ultima fattura',
                    type: 'fattura'
                };

                saveAndRetrieve('1002/2080', bill2, done);

            });


        });


        it('update document', function() {
            bill.description.should.be.equal('ultima fattura');
            bill.formattedCode.should.be.equal('1002/2080');
            bill._id.should.be.a('string');

        });


    });

    describe('save', function() {
        var original;

        before(function(done) {
            original = bill.description;
            var bill2 = bill;
            bill = null;
            bill2.description = bill2.description + '*';

            saveAndRetrieve('1002/2080', bill2, done);


        });
        it('is defined', function() {
            app.fatture.save.should.be.an('function');
        });

        it('update document', function() {
            bill.description.should.be.equal(original + '*');

        });


    });

    describe('save multiple times', function() {


        before(function(done) {
            var original = bill;
            original.description = 'ciao1';

            saveAndRetrieve('1002/2080', original, function() {
                original.description = 'ciao2';
                saveAndRetrieve('1002/2080', original, done);

            });


        });


        it('work', function() {
            bill.description.should.be.equal('ciao2');

        });


    });

    describe('delete', function() {
        before(function(done) {
            deleteAndRetrieve('1002/2080', done);
        });

        it('remove document', function() {
            should.equal(bill, null);

        });

    });

});
