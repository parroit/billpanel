'use strict';

var chai = require('chai');
chai.expect();
chai.should();


var    initData = require('./init-db-data'),

    app = require('../../../lib/model/bills-storage');


app.init({
    couch: {db: 'http://localhost:5984/billy-test'}
});
describe('pagamenti', function () {
    before(function(done){
        initData(done);
    });
    it('is defined', function () {
        app.pagamenti.should.be.an('object');
    });
    describe('all', function () {
        var pagamenti;
        before(function (done) {
            app.pagamenti.all().then(
                function success(result) {
                    pagamenti = result;
                    done();
                }, function fail(err) {
                    throw err;
                }
            );
        });
        it('is defined', function () {
            app.clienti.all.should.be.an('function');
        });

        it('return all pagamenti', function () {
            pagamenti.should.be.an('array');
            pagamenti.length.should.be.equal(1);
            pagamenti[0].description.should.be.equal('Bonifico 30 gg. f.m.');
        });

        it('returned pagamenti has id', function () {
            pagamenti[0]._id.should.be.a('string');

        });
        it('returned pagamenti has type', function () {
            pagamenti[0].type.should.be.equal('pagamento');

        });
        it('returned pagamenti has revision', function () {
            pagamenti[0]._rev.should.be.a('string');

        });
    });

   
});

