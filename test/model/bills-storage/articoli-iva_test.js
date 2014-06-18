'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var    initData = require('./init-db-data');

var    app = require('../../../lib/model/bills-storage');


app.init({
    couch: {db: 'http://localhost:5984/billy-test'}
});
describe('articoliIva', function () {
    before(function(done){
        initData(done);
    });
    it('is defined', function () {
        app.articoliIva.should.be.an('object');
    });
    describe('all', function () {
        var articoliIva;
        before(function (done) {
            app.articoliIva.all().then(
                function success(result) {
                    articoliIva = result;
                    done();
                }, function fail(err) {
                    throw err;
                }
            );
        });

        it('is defined', function () {
            app.clienti.all.should.be.an('function');
        });

        it('return all articoliIva', function () {
            articoliIva.should.be.an('array');
            articoliIva.length.should.be.equal(1);
            articoliIva[0].description.should.be.equal('Art.10 c.6 DPR 633');
        });

        it('returned articoliIva has id', function () {
            articoliIva[0]._id.should.be.a('string');

        });

        it('returned articoliIva has type', function () {
            articoliIva[0].type.should.be.equal('articoloIva');

        });

        it('returned articoliIva has revision', function () {
            articoliIva[0]._rev.should.be.a('string');

        });
    });

   
});

