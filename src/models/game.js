const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/* Schema Definition */
const game = new Schema({
    _id: { type: String, required: true },
    user_ids: { type: Array, required: true },
    game_details: Object,
}, { collection: 'games' });

const diceRollingLock = new Schema({
    _id: { type: String, required: true },
    game_id: { type: String, required: true },
    user_id: { type: String, required: true },
}, { collection: 'dice_rolling_locks' });

module.exports.schema = game;
module.exports.schemaDiceRollingLock = diceRollingLock;
