import * as editorService from './editor.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

export const getEditors = asyncHandler(async (req, res) => {
    const editors = await editorService.getEditors();
    res.status(200).json(editors);
});

export const createEditor = asyncHandler(async (req, res) => {
    const editor = await editorService.createEditor(req.body);
    res.status(201).json(editor);
});

export const updateEditor = asyncHandler(async (req, res) => {
    const editor = await editorService.updateEditor(req.params.id, req.body);
    res.status(200).json(editor);
});

export const deleteEditor = asyncHandler(async (req, res) => {
    await editorService.deleteEditor(req.params.id);
    res.status(200).json({ message: 'Editor deleted successfully.' });
});
