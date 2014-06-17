var model = require('ngoose');

module.exports = model({
        description: String,
        prezzoCadauno: Number,
        quantita: [Number,1],
        numeroRiga: Number
    }
);

