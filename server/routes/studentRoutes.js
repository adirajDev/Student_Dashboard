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
router.use(requireRole('admin'));

router.get('/get-students', getStudents);
router.post('/create-student', createStudent);
router.put('/update-student/:id', updateStudent);
router.delete('/delete-student/:id', deleteStudent);

export default router;