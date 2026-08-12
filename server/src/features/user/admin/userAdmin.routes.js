import { Router } from 'express';
import { makeUserController } from './userAdmin.controller.js';
import { requireRole } from '../../../common/middleware/role.middleware.js';
import { requireAuth } from '../../../common/middleware/auth.middleware.js';

export const createUserRouter = ({ role, permissions }) => {
    const router = Router();
    const controller = makeUserController(role);

    router.use(requireAuth);
    router.get('/', requireRole(...permissions.list), controller.list);
    router.post('/', requireRole(...permissions.create), controller.create);
    router.put('/:id', requireRole(...permissions.update), controller.update);
    router.delete('/:id', requireRole(...permissions.remove), controller.remove);

    return router;
};
