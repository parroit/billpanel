/*
 * auth
 * https://github.com/parroit/auth
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';


var Q = require('q'),
    fs = require('fs'),
    EventEmitter = require('events').EventEmitter;



/**
 * This object allows to manage users
 * within storage.
 * @param {Object} options  configuration options for object
 */
function AuthStorage(options) {
    var _this = this;
    _this.options = options;

    _this.dirty = false;
    _this.events = new EventEmitter();
    fs.exists(options.file,function(exists){
        function noUsersData(err){
            console.log('Starting with empty users data: ' + err.message);
            _this._users = [];
            if (options.onReady) {
                options.onReady();
            }
        }

        if (!exists) {
            return noUsersData(new Error('Users data file not found @ ' +options.file));
        }

        fs.readFile(options.file, {encoding:'utf8'},function(err, data) {
            if (err) {
                return noUsersData(err);
            }
            
            if (! data) {
                return noUsersData(new Error('Users data file empty @ ' +options.file));
            }

            try {
                _this._users = JSON.parse(data);    
            } catch (err){
                return noUsersData(new Error('Users data file is not valid JSON @ ' +options.file +': ' + err.message));
            }
            

            if (options.onReady) {
                options.onReady();
            }
        });
    });
    
}



/**
 * set storage status to dirty, and if it actually clean, cause saving it to disk
 * after a while.
 *
 * @api private
 */
AuthStorage.prototype._setDirty = function() {
    var _this = this;
    if (!this.dirty) {
        setTimeout(function() {
            var content = JSON.stringify(_this._users,undefined,'\t');
            fs.writeFile(_this.options.file, content,{mode: parseInt('0660',8)}, function(err) {
                if (err) {
                    throw err;
                }
                _this.dirty = false;
                _this.events.emit('storageSaved');
            });

            


        }, 200);
        this.dirty = true;
    }
};

/**
 * Save a user into storage.
 *
 * @param {Object} user  the user object to save
 * @return {Object} a promise fullfilled with {status: 'ok'}
 * @api public
 */
AuthStorage.prototype.saveUser = function(user) {
    this._setDirty();

    var users = this._users;

    return Q.fcall(function() {
        users[user.username] = user;
        return {
            status: 'ok'
        };
    });
};



/**
 * Retrieve a user from storage by name.
 *
 * @param {String} username  the username of the user to retrieve
 * @return {Object} a promise fullfilled with user object
 * @api public
 */
AuthStorage.prototype.getUser = function(username) {
    var users = this._users;
    return Q.fcall(function() {
        return users[username] || null;
    });
};

/**
 * Retrieve a user from storage by email.
 *
 * @param {String} email  the email of the user to retrieve
 * @return {Object} a promise fullfilled with user object
 * @api public
 */
AuthStorage.prototype.getUserByEmail= function(email) {
    var users = this._users;
     
    return Q.fcall (function() {
        var results = Object.keys(users).filter(function(username){
            var user = users[username];
            return user.email === email;
        });

        return results.length ? results[0] : null;
        
    });
};


/**
 * Remove a user from storage.
 *
 * @param {String} username  username of user to remove
 * @return {Object} a promise fullfilled with {status: 'ok'}
 * @api public
 */
AuthStorage.prototype.removeUser = function(username) {
    this._setDirty();
    var users = this._users;
    return Q.fcall(function() {
        delete users[username];
         return {
            status: 'ok'
        };
    });
};

module.exports = AuthStorage;
