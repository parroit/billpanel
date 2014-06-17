
function defineModule(moment){
    function define(obj,propertyName,getFunction){
        delete obj[propertyName];
        Object.defineProperty(obj, propertyName, {
            get: getFunction,
            enumerable: true,
            configurable: true
        });
    }

    function enhanceRiga(dati) {
        try {
            define(dati, "total", function () {

                var total = this.prezzoCadauno * this.quantita;
                //console.log("TOTAL: %d",total);
                return  total;
            });

            define(dati, "hasQty", function () {

                return  this.quantita != 0;
            });    
        } catch(err){
            console.log(err);
        }
        
        return dati;
    }

    return enhanceRiga;
}

if (typeof module != "undefined" && module.exports) {
    module.exports = defineModule(
        require('moment')
    );    
} else {
    define(["moment"],defineModule);
}


