const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { protect, isRecruiter } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createCompanyValidator,
  updateCompanyValidator,
} = require('../validators/company.validator');

// Public routes
router.get('/', companyController.getAllCompanies);
router.get('/search', companyController.searchCompanies);
router.get('/:id', companyController.getCompanyById);

// Protected recruiter routes
router.post('/', protect, isRecruiter, createCompanyValidator, validate, companyController.createCompany);
router.get('/me', protect, isRecruiter, companyController.getMyCompany);
router.put('/:id', protect, isRecruiter, updateCompanyValidator, validate, companyController.updateCompany);
router.delete('/:id', protect, isRecruiter, companyController.deleteCompany);

module.exports = router;

