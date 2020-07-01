import _ from 'lodash';
import mongoose from 'mongoose';
import DatabaseFactory from '../db/databaseFactory';
import gameSchema from '../models/game';


/**
 * @class Game class contains all functionalities related to games
 * @requires mongoose
 * @requires DatabaseFactory
 * @requires gameSchema
 * @requires config
 */
class Game {
	constructor() {
		try {
			this.db = new DatabaseFactory({ databaseName: 'mongodb', connectionString: config.db.mongoDB });
		} catch (e) {
			console.log('failed to connect to mongodb', e);
			process.exit(1);
		}
	}

	async startGame(input) {
		if (_.isNull(input) || _.isUndefined(input) || _.isEmpty(input)) {
			return { err: 'inpunt can not be empty or null while saving game', result: null };
		}
		return new Promise(async (resolve, reject) => {
			const data = _.cloneDeep(input);
			data._id = mongoose.Types.ObjectId();
			const { err, result } = await this.db.insert(gameSchema.schema, data);
			return (!_.isNull(err)) ? reject(err) : resolve(result);
		});
	}

	async getGameInfo(gameIDs){
		if (_.isNull(gameIDs) || _.isUndefined(gameIDs) || _.isEmpty(gameIDs)) {
			return { err: 'gameIDs can not be empty or null while getting game info', result: null };
		}
		return new Promise(async (resolve, reject) => {
			let output = { err: null, result: null };
			const query = { _id: { $in: gameIDs } };
			output = await this.db.findAll(gameSchema.schema, query, this.db.excludeFields);
			const result = (_.isNull(output.result)) ? output.err : output.result;
			return (!_.isNull(output.err)) ? reject(output.err) : resolve(result);
		});
	}

	async rollDice(data) {
		if (_.isNull(data) || _.isUndefined(data) || _.isEmpty(data)) { 
			return { err: 'data can not be empty or null while rolling dice', result: null };
		}
		return new Promise(async (resolve, reject) => {
			var query = { _id: data.game_id },
				update = { "$set": {}, returnOriginal: false  },
				options = { "upsert": true };
			update["$set"]["game_details." + data.user_id+".is_your_turn"] = false;
			update["$set"]["game_details." + data.user_id+".sum_of_outcomes"] = data.sum_of_outcomes;
			update["$set"]["game_details." + data.user_id+".dice_outcomes"] = data.dice_outcomes;
			update["$set"]["game_details." + data.user_id+".dice_rolling_count"] = data.dice_rolling_count;
			if(!_.isUndefined(data.winning_user_id)){
				update["$set"]["game_details.status"] = data.status;
				update["$set"]["game_details.winning_user_id"] = data.winning_user_id;
			} else {
				update["$set"]["game_details." + data.next_user_id+".is_your_turn"] = true;
			}

			const { err, result } = await this.db.update(gameSchema.schema, query, update, options);
			return (!_.isNull(err)) ? reject(err) : resolve(result);
		});
	}

	async addDiceRollingLock(input) {
		if (_.isNull(input) || _.isUndefined(input) || _.isEmpty(input)) {
			return { err: 'inpunt can not be empty or null while adding dice rolling lock', result: null };
		}
		return new Promise(async (resolve, reject) => {
			const data = _.cloneDeep(input);
			data._id = mongoose.Types.ObjectId();
			const { err, result } = await this.db.insert(gameSchema.schemaDiceRollingLock, data);
			return (!_.isNull(err)) ? reject(err) : resolve(result);
		});
	}

	async deleteDiceRollingLock(queryParams) {
		if (_.isNull(queryParams) || _.isUndefined(queryParams) || _.isEmpty(queryParams)) { 
			return { err: 'queryParams or data can not be empty or null while deleting dice rolling lock', result: null };
		}
		return new Promise(async (resolve, reject) => {
			const query = { game_id: queryParams.game_id, user_id : queryParams.user_id };
			const options = { returnOriginal: false };
			const { err, result } = await this.db.delete(gameSchema.schemaDiceRollingLock, query);
			return (!_.isNull(err)) ? reject(err) : resolve(result);
		});
	}
}

export default Game;
