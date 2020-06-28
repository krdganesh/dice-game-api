import KoaRouter from 'koa-router';
import User from './user';

export default class IndexRouter extends KoaRouter {
	constructor() {
		super();
		const self = this;
		self.userRouter = new User();
	}

	attachRoutes() {
		const self = this;
		self.userRouter.attachRoutes(self);
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
