const GAME_RULES = {
	START_GAME: {
		user_ids: { type: 'array', length: 4 }
	},
	ROLL_DICE_ID:{
		game_id: { type: 'string' },
	},
	ROLL_DICE_DATA:{
		user_id: { type: 'string' },
	}
};

module.exports = GAME_RULES;
