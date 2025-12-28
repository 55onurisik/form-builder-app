const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const submissionController = require('../controllers/submissionController');

router.post('/', formController.createForm);
router.get('/', formController.getAllForms);
router.get('/:id', formController.getFormById);
router.put('/:id', formController.updateForm);
router.delete('/:id', formController.deleteForm);

// Submission Routes
router.post('/:id/submissions', submissionController.submitForm);
router.get('/:id/submissions', submissionController.getSubmissionsByFormId);

module.exports = router;
