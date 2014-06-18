var express = require("express"),
    hogan = require("hogan-express"),
    passport = require("passport"),
    flash = require('connect-flash'),
    less = require("less-middleware"),
    prettyErrorHandler = require("./pretty-error-handler/index"),


    SessionDiskStore = require("./session-disk-store")(express.session.Store),
    fs = require("fs"),

    productionConfigFile = __dirname + "/../config/config.json",
    testConfigFile = __dirname + "/../config/test-config.json",
    configFile = fs.existsSync(productionConfigFile) ? productionConfigFile : testConfigFile,
    configContent = fs.readFileSync(configFile, "utf8"),
    initStorage = require("./bills/initStorage"),
    config = JSON.parse(configContent);


configureApp.config = config;
module.exports = configureApp;

configurePassport() ;
initStorage(config);



function configurePassport() {
    var strategy = require("./passport-strategy.js");

    passport.use(strategy);

    passport.serializeUser(strategy.serialize);

    passport.deserializeUser(strategy.deserialize);
}


function configureApp(app) {

    /*****************
     * view
     *****************/
    app.set("view engine", "html");
    app.set("views", process.cwd()+"/server/views");
    app.set("layout", "layout");
    //app.enable "view cache"
    app.engine("html", hogan);

    /*****************
     * base
     *****************/

    app.use(prettyErrorHandler.handleErrorEvent);

    app.use(express.logger(config.logger));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({
        secret: config.auth.cookieSecret,
        store: new SessionDiskStore(config.sessions)
    }));
    app.use(flash());




    /*****************
     * assets
     *****************/
    app.use(less({
        src: __dirname + "/../../client"
    }));
    app.use(express.static(__dirname + "/isomorphic"));
    app.use(express.static(__dirname + "/../../client"));
    app.use(express.static(__dirname + "/../../client/bower_components"));

    /*****************
     * passport
     *****************/

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);

    /*****************
     * errors management
     *****************/
    app.use(prettyErrorHandler.handleNotFound);
    app.use(prettyErrorHandler.handleException);

    app.config = config;
} ;

