'use strict';

import { Router } from 'express';
import Controller from './controller';

const Routes = new Router();

Routes.route('/').post(Controller.receive);

export default Routes;
