import express from 'express';
import { getEditors, createEditor, updateEditor, deleteEditor } from '../controllers/editorController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();
router.use(requireAuth);

// ONLY Admin can access these routes
router.use(requireRole('admin'));

router.get('/get-editors', getEditors);
router.post('/create-editor', createEditor);
router.put('/update-editor/:id', updateEditor);
router.delete('/delete-editor/:id', deleteEditor);

export default router;