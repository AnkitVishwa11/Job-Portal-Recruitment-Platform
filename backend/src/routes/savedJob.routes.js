const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/savedJob.controller');
const { protect, isJobSeeker } = require('../middleware/auth');

// All routes are protected and for job seekers only
router.post('/', protect, isJobSeeker, savedJobController.saveJob);
router.get('/', protect, isJobSeeker, savedJobController.getSavedJobs);
router.get('/check/:jobId', protect, isJobSeeker, savedJobController.checkSavedJob);
router.put('/:id', protect, isJobSeeker, savedJobController.updateSavedJobNotes);
router.delete('/:id', protect, isJobSeeker, savedJobController.unsaveJob);

module.exports = router;

