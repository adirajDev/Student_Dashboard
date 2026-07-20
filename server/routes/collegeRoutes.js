import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/role.js'
import { createCollege, deleteCollege, getCollegeById, getColleges, updateCollege } from '../controllers/collegeControllers.js'

const router = express.Router();
router.get('/', getColleges);
router.get('/:id', getCollegeById);

router.use(requireAuth);
router.use(requireRole('admin'))

router.post('/create-college', createCollege)
router.patch('/update-college/:collegeId', updateCollege)
router.delete('/delete-college/:collegeId', deleteCollege)

export default router;