import express from 'express';
import { requireAuth } from '../../common/middleware/auth.middleware.js';
import { requireRole } from '../../common/middleware/role.middleware.js';
import {
    createCollege,
    deleteCollege,
    getCollegeById,
    getColleges,
    updateCollege,
} from './college.controller.js';

const router = express.Router();
router.get('/', getColleges);
router.get('/:id', getCollegeById);

router.use(requireAuth);
router.use(requireRole('admin'));

router.post('/create-college', createCollege);
router.patch('/update-college/:collegeId', updateCollege);
router.delete('/delete-college/:collegeId', deleteCollege);

export default router;
