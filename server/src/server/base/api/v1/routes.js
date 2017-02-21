'use strict';

import { Router } from 'express';
import Controller from './controller';

const router = new Router();

router.route('/').post(Controller.receive);

export default router;
