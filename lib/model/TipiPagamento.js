var model = require('ngoose');

module.exports = model({
    description: String,
    giorni: [Number,30],
    fineMese: Boolean,
    type: [String,'pagamento']
});