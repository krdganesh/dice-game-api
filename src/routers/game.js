import GameController from '../controllers/GameController';

export default class UserRouter {
	constructor() {
		this.gameController = new GameController();
	}

	attachRoutes(router) {
		const self = this;
		return router
            .post('/game/start', self.gameController.startGame)
            .put('/game/roll_dice/:game_id', self.gameController.rollDice)
	}
}
