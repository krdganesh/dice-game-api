import KoaRouter from 'koa-router';
import User from './user';
import Game from './game';

export default class IndexRouter extends KoaRouter {
	constructor() {
		super();
		const self = this;
		self.userRouter = new User();
		self.gameRouter = new Game();
	}

	attachRoutes() {
		const self = this;
		self.userRouter.attachRoutes(self);
		self.gameRouter.attachRoutes(self);
	}

	indexRoutes() {
		this.get('/', async (ctx) => {
			ctx.body = {
				appName: 'dice-game-api',
				author: 'Ganesh Karande',
			};
		});
	}
}
