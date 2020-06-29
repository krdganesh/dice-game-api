const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/* Schema Definition */
const game = new Schema({
    _id: { type: String, required: true },
    user_ids: { type: Array, required: true },
    game_details: Object,
}, { collection: 'games' });

module.exports.schema = game;
