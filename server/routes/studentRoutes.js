import express from 'express'
import { 
    getStudents, 
    createStudent,
    updateStudent, 
    deleteStudent
} from '../controllers/studentController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

router.use(requireAuth);
// router.use(requireRole('admin', 'editor'));

router.get('/get-students',requireRole('admin', 'editor'), getStudents);
router.post('/create-student', requireRole('admin'), createStudent);
router.put('/update-student/:id', requireRole('admin', 'editor'), updateStudent);
router.delete('/delete-student/:id', requireRole('admin'), deleteStudent);

export default router;