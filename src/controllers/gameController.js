import _, { forEach } from 'lodash';
import Game from '../modules/game';
import User from '../modules/user';
import ResponseGenerator from '../libs/responseGenerator';
import statusCodes from '../libs/status_codes';
import CustomError from '../libs/customError';
import Utils from '../libs/utils';
import GameRules from '../rules/gameRules';


const responseGenerator = new ResponseGenerator();
const game = new Game();
const user = new User();
const utils = new Utils({});

export default class GameController {
	/**
	 * Saves User in the database.
	 * @param {ctx} koa-context-object - this field contains the POST data.
	 * @returns {object} response The standard api response
	 */
	async startGame(ctx) {
		let response = {};
		const validate = utils.validateParams(GameRules.START_GAME, ctx.request.body, false);
		if (!validate.err) {
			var { err, result } = await utils.invoker(user.getUserInfo(ctx.request.body.user_ids));
			if (!_.isNull(err)) {
				let error = {};
				error = new CustomError('database operation failed', 'could not get user info');
				response = responseGenerator.generateResponse(error, result, statusCodes.DATABASE_FAILURE);
				ctx.status = statusCodes.DATABASE_FAILURE.code;
				ctx.body = response;
				return;
			}
			if (result.length != ctx.request.body.user_ids.length) {
				let error = {};
				error = new CustomError('invalid user_ids', 'game could not be started');
				response = responseGenerator.generateResponse(error, null, statusCodes.VALIDATION_FAILURE);
				ctx.status = statusCodes.VALIDATION_FAILURE.code;
				ctx.body = response;
				return;
			}

			let game_details = {};
			for (let i = 0; i < ctx.request.body.user_ids.length; i++) {
				game_details[ctx.request.body.user_ids[i]] = {
					is_your_turn: i == 0 ? true : false,
					dice_rolling_count: 0,
					dice_outcomes: [],
					sum_of_outcomes : 0
				}
			}
			ctx.request.body.game_details = game_details;
			var { err, result } = await utils.invoker(game.startGame(ctx.request.body));
			if (!_.isNull(err)) {
				let error = {};
				if (!err.code === 11000) {
					error = new CustomError('database operation failed', 'game could not be started');
					response = responseGenerator.generateResponse(error, result, statusCodes.DATABASE_FAILURE);
					ctx.status = statusCodes.DATABASE_FAILURE.code;
				} else {
					error = new CustomError(`game : ${validate.name} is already present in DB with same properties, game could not be started.`, 'game could not be inserted');
					response = responseGenerator.generateResponse(error, result, statusCodes.DATABASE_FAILURE);
					ctx.status = statusCodes.DATABASE_FAILURE.code;
				}
			} else {
				const customResult = 'game started';
				response = responseGenerator.generateResponse(err, customResult, statusCodes.API_SUCCESS);
				response._id = result._id;
				ctx.status = statusCodes.API_SUCCESS.code;
			}
			ctx.body = response;
		} else {
			const error = new CustomError('Validation failed', validate.err);
			const response = responseGenerator.generateResponse(error, null, statusCodes.VALIDATION_FAILURE);
			ctx.status = statusCodes.VALIDATION_FAILURE.code;
			ctx.body = response;
		}
	}

	async rollDice(ctx) {
		const queryParams = ctx.params;
		const data = ctx.request.body;
		const validateQuery = utils.validateParams(GameRules.ROLL_DICE_ID, queryParams, false);
		const validateData = utils.validateParams(GameRules.ROLL_DICE_DATA, data, false);
		if (!validateQuery.err && !validateData.err) {
			let response = {};
			var { err, result } = await utils.invoker(game.getGameInfo(new Array(queryParams.game_id)));
			if (!_.isNull(err)) {
				const error = new CustomError('database operation failed', 'could not get game info');
				response = responseGenerator.generateResponse(error, result, statusCodes.DATABASE_FAILURE);
				ctx.status = statusCodes.DATABASE_FAILURE.code;
				ctx.body = response;
				return;
			}
			const userGameInfo = result[0].game_details[validateData.user_id];
			if(userGameInfo.is_your_turn == false){
				const error = new CustomError('validation failed', 'its not your turn, kindly wait for your turn');
				response = responseGenerator.generateResponse(error, null, statusCodes.VALIDATION_FAILURE);
				ctx.status = statusCodes.VALIDATION_FAILURE.code;
				ctx.body = response;
				return;
			}

			data.game_id = queryParams.game_id;
			data.dice_outcome = Math.floor(Math.random() * 6) + 1;
			data.dice_outcomes = userGameInfo.dice_outcomes;
			data.dice_outcomes.push(data.dice_outcome);
			data.sum_of_outcomes = userGameInfo.sum_of_outcomes + data.dice_outcome;
			data.dice_rolling_count = userGameInfo.dice_rolling_count+1;
			const indexOfUser = result[0].user_ids.indexOf(validateData.user_id);
			data.next_user_id = indexOfUser + 1 < result[0].user_ids.length ? result[0].user_ids[indexOfUser + 1] : result[0].user_ids[0];
			var { err, result } = await utils.invoker(game.rollDice(data));
			
			if (!_.isNull(err)) {
				const error = new CustomError('database operation failed', 'dice could not be rolled');
				response = responseGenerator.generateResponse(error, result, statusCodes.DATABASE_FAILURE);
				ctx.status = statusCodes.DATABASE_FAILURE.code;
			} else {
				if(data.sum_of_outcomes >= 61){
					const customResult = 'you scored : '+data.dice_outcome+' and you have won the game!';
					response = responseGenerator.generateResponse(err, customResult, statusCodes.API_SUCCESS);
					ctx.status = statusCodes.API_SUCCESS.code;
				} else {
					const customResult = 'you scored : '+data.dice_outcome;
					response = responseGenerator.generateResponse(err, customResult, statusCodes.API_SUCCESS);
					ctx.status = statusCodes.API_SUCCESS.code;
				}
			}
			ctx.body = response;
		} else {
			const error = new CustomError('Validation failed', validateQuery.err, validateData.err);
			const response = responseGenerator.generateResponse(error, null, statusCodes.VALIDATION_FAILURE);
			ctx.status = statusCodes.VALIDATION_FAILURE.code;
			ctx.body = response;
		}
	}
}
