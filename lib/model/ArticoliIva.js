var model = require('ngoose');



module.exports = model({
    clausolaStampa: String,
    percentuale: [Number,20],
    description: String,
    type: [String,'articoloIva']
});
