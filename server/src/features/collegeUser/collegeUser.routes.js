import express from 'express';
import { getCollegeUsers, createCollegeUser, updateCollegeUser, deleteCollegeUser } from './collegeUser.controller.js';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/role.middleware.js';

const router = express.Router();
router.use(requireAuth);
router.use(requireRole('admin')); // Only Admin can manage college users

router.get('/get-collegeUsers', getCollegeUsers);
router.post('/create-collegeUser', createCollegeUser);
router.put('/update-collegeUser/:id', updateCollegeUser);
router.delete('/delete-collegeUser/:id', deleteCollegeUser);

export default router;
