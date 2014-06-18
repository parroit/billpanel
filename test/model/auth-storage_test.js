'use strict';

var chai = require('chai');
chai.expect();
var should = chai.should();

var    fs = require('fs'),
    AuthStorage = require('../../lib/model/auth-storage');


describe('AuthStorage', function() {
    var originalConfigFile = 'test/model/user-storage/original-users.json',
        configFile = 'test/model/user-storage/users.json',
        authStorage;

    before(function(done) {

        function createIt() {
            authStorage = new AuthStorage({
                file: configFile,
                onReady: done
            });
        }

        if (! fs.existsSync(configFile)) {
            var wr = fs.createWriteStream(configFile),
                rd = fs.createReadStream(originalConfigFile);

            rd.on('error', function(err) {
                throw err;
            });

            wr.on('error', function(err) {
                throw err;
            });

            wr.on('close', createIt);


            rd.pipe(wr);

        } else {
            createIt();
        }

    });

    it('is defined', function() {
        AuthStorage.should.be.an('function');
    });

    it('is instantiable', function() {
        authStorage.should.be.an('object');
    });

    it('read config files at start', function(done) {
        authStorage.getUser('ola').then(function(usr) {
            usr.should.be.an('object');
            usr.fullname.should.be.equal('parroit');
            done();
        });



    });

    function itInvokeStorageSave(action) {
        describe('cause storageSaved event to be emitted', function() {
            var configExists = false;
            before(function(done) {
                //var count = 0;

                function checkStorageSaved() {
                    configExists = fs.existsSync(configFile);
                    done();
                    authStorage.events.removeListener('storageSaved', checkStorageSaved);
                }

                function waitStorageClean() {
                    if (!authStorage.dirty) {

                        authStorage.events.on('storageSaved', checkStorageSaved);

                        if (fs.existsSync(configFile)) {
                            fs.unlinkSync(configFile);
                        }

                        action();

                    } else {

                        setTimeout(waitStorageClean, 10);
                    }

                }

                waitStorageClean();

            });

            it('set dirty to false', function() {
                authStorage.dirty.should.be.equal(false);
            });

            it('save users to file', function() {
                configExists.should.be.equal(true);
            });
        });
    }



    describe('saveUser', function() {
        var user,
            dirtyAtStart;

        before(function(done) {
            dirtyAtStart = authStorage.dirty;
            authStorage.saveUser({
                username: 'parroit',
                password: 'piripicchio',
                fullname: 'Andrea Parodi',
                email: 'andrea.parodi@ebansoftware.net',
                status: 'pending'
            })
                .then(function() {
                    getParroit(function(usr) {
                        user = usr;
                        done();
                    });

                })

            .then(null, function(err) {
                console.log(err.stack);
            })

            .catch(done);
        });

        it('user object is stored', function() {
            user.should.be.an('object');
        });

        it('dirty false at start', function() {
            dirtyAtStart.should.be.equal(false);
        });

        it('set storage to dirty', function() {
            authStorage.dirty.should.be.equal(true);
        });


        itInvokeStorageSave(function() {
            authStorage.saveUser({
                username: 'parroit2',
                password: 'piripicchio',
                fullname: 'Andrea Parodi',
                email: 'andrea.parodi@ebansoftware.net',
                status: 'pending'
            });
        });

    });

    function getParroit(cb) {
        authStorage.getUser('parroit')

        .then(function(usr) {
            cb(usr);
        })

        .then(null, function(err) {
            console.log(err.stack);
        });
    }

    describe('getUser', function() {
        var user;

        before(function(done) {

            getParroit(function(usr) {
                user = usr;
                done();
            });

        });

        it('user is object', function() {
            user.should.be.an('object');
        });

        it('user has email', function() {
            user.email.should.be.equal('andrea.parodi@ebansoftware.net');
        });

        it('user has username', function() {
            user.username.should.be.equal('parroit');
        });

        it('user has fullname', function() {
            user.fullname.should.be.equal('Andrea Parodi');
        });

        it('user has status', function() {
            user.status.should.be.equal('pending');
        });

        it('user has password hash', function() {
            user.password.should.be.a('string');
        });
    });



    describe('removeUser', function() {
        var user;

        before(function(done) {
            authStorage.removeUser('parroit')
                .then(function() {
                    getParroit(function(usr) {
                        user = usr;
                        done();
                    });

                })

            .then(null, function(err) {
                console.log(err.stack);
            });
        });

        it('user object is removed', function() {
            should.equal(user, null);
        });

        itInvokeStorageSave(function() {
            authStorage.removeUser('parroit2');
        });
    });
});