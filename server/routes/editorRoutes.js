import express from 'express';
import { getEditors, createEditor, updateEditor, deleteEditor } from '../controllers/editorController.js';
import { requireAuth } from '../src/common/middleware/auth.middleware.js';
import { requireRole } from '../src/common/middleware/role.middleware.js';

const router = express.Router();
router.use(requireAuth);

// ONLY Admin can access these routes
router.use(requireRole('admin'));

router.get('/get-editors', getEditors);
router.post('/create-editor', createEditor);
router.put('/update-editor/:id', updateEditor);
router.delete('/delete-editor/:id', deleteEditor);

export default router;