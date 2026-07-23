const { Company, Job } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a company profile
 * @param {Object} companyData - Company data
 * @param {string} userId - User ID (recruiter)
 * @returns {Object} Created company
 */
const createCompany = async (companyData, userId) => {
  const existingCompany = await Company.findOne({ userId });
  if (existingCompany) {
    throw new ApiError(400, 'You already have a company profile');
  }

  const company = await Company.create({
    ...companyData,
    userId,
  });

  return company;
};

/**
 * Get company by user ID
 * @param {string} userId - User ID
 * @returns {Object} Company object
 */
const getCompanyByUserId = async (userId) => {
  const company = await Company.findOne({ userId });
  if (!company) {
    throw new ApiError(404, 'Company profile not found');
  }
  return company;
};

/**
 * Get company by ID
 * @param {string} companyId - Company ID
 * @returns {Object} Company object
 */
const getCompanyById = async (companyId) => {
  const company = await Company.findById(companyId).populate('userId', 'firstName lastName email');
  if (!company) {
    throw new ApiError(404, 'Company not found');
  }
  return company;
};

/**
 * Update company profile
 * @param {string} companyId - Company ID
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated company
 */
const updateCompany = async (companyId, userId, updateData) => {
  const company = await Company.findOne({ _id: companyId, userId });
  if (!company) {
    throw new ApiError(404, 'Company not found or unauthorized');
  }

  Object.assign(company, updateData);
  await company.save();

  return company;
};

/**
 * Delete company profile
 * @param {string} companyId - Company ID
 * @param {string} userId - User ID
 */
const deleteCompany = async (companyId, userId) => {
  const company = await Company.findOneAndDelete({ _id: companyId, userId });
  if (!company) {
    throw new ApiError(404, 'Company not found or unauthorized');
  }

  // Close all jobs associated with this company
  await Job.updateMany(
    { companyId: company._id },
    { status: 'closed', isActive: false }
  );
};

/**
 * Get all companies with pagination and filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination params
 * @returns {Object} Companies and pagination metadata
 */
const getAllCompanies = async (filters = {}, pagination = {}) => {
  const { page, limit, skip } = pagination;
  const query = { isActive: true, ...filters };

  const [companies, total] = await Promise.all([
    Company.find(query)
      .populate('userId', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Company.countDocuments(query),
  ]);

  return {
    companies,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Search companies by name or description
 * @param {string} searchTerm - Search term
 * @param {Object} pagination - Pagination params
 * @returns {Object} Companies and pagination metadata
 */
const searchCompanies = async (searchTerm, pagination = {}) => {
  const { page, limit, skip } = pagination;
  const query = {
    isActive: true,
    $or: [
      { companyName: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { industry: { $regex: searchTerm, $options: 'i' } },
    ],
  };

  const [companies, total] = await Promise.all([
    Company.find(query)
      .populate('userId', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Company.countDocuments(query),
  ]);

  return {
    companies,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

module.exports = {
  createCompany,
  getCompanyByUserId,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getAllCompanies,
  searchCompanies,
};
