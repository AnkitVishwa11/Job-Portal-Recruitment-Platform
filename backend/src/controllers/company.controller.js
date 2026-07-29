const companyService = require('../services/company.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const { isDbConnected, MOCK_COMPANIES } = require('../utils/mockFallback');

/**
 * @desc    Create company profile
 * @route   POST /api/companies
 * @access  Private/Recruiter
 */
const createCompany = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    return ApiResponse.created(res, 'Company profile created successfully (Demo Mode)', { company: MOCK_COMPANIES[0] });
  }
  const company = await companyService.createCompany(req.body, req.user._id);
  return ApiResponse.created(res, 'Company profile created successfully', { company });
});

/**
 * @desc    Get current user's company
 * @route   GET /api/companies/me
 * @access  Private/Recruiter
 */
const getMyCompany = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    return ApiResponse.success(res, 'Company retrieved successfully (Demo Mode)', { company: MOCK_COMPANIES[0] });
  }
  const company = await companyService.getCompanyByUserId(req.user._id);
  return ApiResponse.success(res, 'Company retrieved successfully', { company });
});

/**
 * @desc    Get company by ID
 * @route   GET /api/companies/:id
 * @access  Public
 */
const getCompanyById = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    const company = MOCK_COMPANIES.find((c) => c._id === req.params.id) || MOCK_COMPANIES[0];
    return ApiResponse.success(res, 'Company retrieved successfully (Demo Mode)', { company });
  }
  const company = await companyService.getCompanyById(req.params.id);
  return ApiResponse.success(res, 'Company retrieved successfully', { company });
});

/**
 * @desc    Update company profile
 * @route   PUT /api/companies/:id
 * @access  Private/Recruiter
 */
const updateCompany = catchAsync(async (req, res) => {
  const company = await companyService.updateCompany(req.params.id, req.user._id, req.body);
  return ApiResponse.success(res, 'Company updated successfully', { company });
});

/**
 * @desc    Delete company profile
 * @route   DELETE /api/companies/:id
 * @access  Private/Recruiter
 */
const deleteCompany = catchAsync(async (req, res) => {
  await companyService.deleteCompany(req.params.id, req.user._id);
  return ApiResponse.success(res, 'Company deleted successfully');
});

/**
 * @desc    Get all companies
 * @route   GET /api/companies
 * @access  Public
 */
const getAllCompanies = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    return ApiResponse.success(res, 'Companies retrieved successfully (Demo Mode)', {
      companies: MOCK_COMPANIES,
      total: MOCK_COMPANIES.length,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  }
  const { page, limit, skip } = req.pagination;
  const result = await companyService.getAllCompanies(req.filters, { page, limit, skip });
  return ApiResponse.success(res, 'Companies retrieved successfully', result);
});

/**
 * @desc    Search companies
 * @route   GET /api/companies/search
 * @access  Public
 */
const searchCompanies = catchAsync(async (req, res) => {
  if (!isDbConnected()) {
    return ApiResponse.success(res, 'Companies found successfully (Demo Mode)', {
      companies: MOCK_COMPANIES,
      total: MOCK_COMPANIES.length,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  }
  const { page, limit, skip } = req.pagination;
  const { q } = req.query;
  const result = await companyService.searchCompanies(q, { page, limit, skip });
  return ApiResponse.success(res, 'Companies found successfully', result);
});

module.exports = {
  createCompany,
  getMyCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getAllCompanies,
  searchCompanies,
};

