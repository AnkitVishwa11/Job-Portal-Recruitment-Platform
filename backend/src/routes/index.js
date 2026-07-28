const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const companyRoutes = require('./company.routes');
const jobRoutes = require('./job.routes');
const applicationRoutes = require('./application.routes');
const savedJobRoutes = require('./savedJob.routes');
const adminRoutes = require('./admin.routes');
const notificationRoutes = require('./notification.routes');
const dashboardRoutes = require('./dashboard.routes');

// API health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Job Portal API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Temporary Database Seeder Route
router.get('/seed', async (req, res, next) => {
  try {
    const User = require('../models/User');
    const Company = require('../models/Company');
    const Job = require('../models/Job');

    // Clean existing collections to start fresh
    await Job.deleteMany({});
    await Company.deleteMany({});

    // 1. Recruiter 1: Razorpay
    let recruiter1 = await User.findOne({ email: 'recruiter@example.com' });
    if (!recruiter1) {
      recruiter1 = await User.create({
        firstName: 'Aravind',
        lastName: 'Sharma',
        email: 'recruiter@example.com',
        password: 'Password123!',
        role: 'recruiter',
        phone: '9876543210'
      });
    }
    const company1 = await Company.create({
      userId: recruiter1._id,
      companyName: 'Razorpay',
      industry: 'FinTech',
      companySize: '501-1000',
      website: 'https://razorpay.com',
      description: 'Razorpay is India’s leading FinTech company that helps business payments and banking solutions for merchants.',
      location: {
        address: 'Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        zipCode: '560034'
      }
    });

    // 2. Recruiter 2: Flipkart
    let recruiter2 = await User.findOne({ email: 'recruiter2@example.com' });
    if (!recruiter2) {
      recruiter2 = await User.create({
        firstName: 'Priya',
        lastName: 'Nair',
        email: 'recruiter2@example.com',
        password: 'Password123!',
        role: 'recruiter',
        phone: '9876543211'
      });
    }
    const company2 = await Company.create({
      userId: recruiter2._id,
      companyName: 'Flipkart',
      industry: 'E-Commerce',
      companySize: '1000+',
      website: 'https://flipkart.com',
      description: 'Flipkart is India’s leading e-commerce marketplace offering millions of products to customers.',
      location: {
        address: 'Outer Ring Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        zipCode: '560103'
      }
    });

    // 3. Recruiter 3: Zomato
    let recruiter3 = await User.findOne({ email: 'recruiter3@example.com' });
    if (!recruiter3) {
      recruiter3 = await User.create({
        firstName: 'Rahul',
        lastName: 'Mehta',
        email: 'recruiter3@example.com',
        password: 'Password123!',
        role: 'recruiter',
        phone: '9876543212'
      });
    }
    const company3 = await Company.create({
      userId: recruiter3._id,
      companyName: 'Zomato',
      industry: 'FoodTech',
      companySize: '1000+',
      website: 'https://zomato.com',
      description: 'Zomato is a leading global restaurant search, discovery, and food delivery platform.',
      location: {
        address: 'DLF Phase 5',
        city: 'Gurugram',
        state: 'Haryana',
        country: 'India',
        zipCode: '122002'
      }
    });

    // 4. Recruiter 4: TCS
    let recruiter4 = await User.findOne({ email: 'recruiter4@example.com' });
    if (!recruiter4) {
      recruiter4 = await User.create({
        firstName: 'Vijay',
        lastName: 'Patel',
        email: 'recruiter4@example.com',
        password: 'Password123!',
        role: 'recruiter',
        phone: '9876543213'
      });
    }
    const company4 = await Company.create({
      userId: recruiter4._id,
      companyName: 'Tata Consultancy Services',
      industry: 'IT Services',
      companySize: '1000+',
      website: 'https://tcs.com',
      description: 'Tata Consultancy Services is a global leader in IT services, consulting, and business solutions.',
      location: {
        address: 'Hinjawadi',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '411057'
      }
    });

    // Create Indian Job Postings
    await Job.create([
      {
        companyId: company1._id,
        userId: recruiter1._id,
        title: 'Senior Frontend Developer (React)',
        description: 'We are looking for a Senior Frontend Developer specializing in React.js to build, scale and optimize merchant dashboard features.',
        requirements: [
          '5+ years of experience with modern frontend frameworks (React, Redux, Next.js).',
          'Deep understanding of JavaScript, CSS, HTML5, and responsive designs.',
          'Experience optimizing React load times, bundle sizes, and performance profiling.'
        ],
        responsibilities: [
          'Design and build high-performance dashboard interfaces using React.',
          'Collaborate with backend teams to integrate RESTful API endpoints.',
          'Mentor junior engineers and conduct high-quality code reviews.'
        ],
        location: 'Bengaluru, Karnataka (Hybrid)',
        workType: 'hybrid',
        employmentType: 'full-time',
        experienceLevel: 'senior',
        salaryRange: {
          min: 1800000,
          max: 2400000,
          currency: 'INR',
          isNegotiable: true
        },
        skills: ['React', 'Redux', 'JavaScript', 'Webpack', 'CSS3'],
        benefits: ['Medical Insurance', 'Flexible Hours', 'Stock Options', 'Learning Allowance']
      },
      {
        companyId: company2._id,
        userId: recruiter2._id,
        title: 'Product Designer (UI/UX)',
        description: 'Flipkart is looking for a Product Designer to design the shopping cart and checkout experiences for millions of active users.',
        requirements: [
          '3+ years of experience designing mobile-first consumer applications.',
          'Proficiency with design tools like Figma, Sketch, and Illustrator.',
          'A strong portfolio showcasing interaction design and design systems.'
        ],
        responsibilities: [
          'Conduct user research, design wireframes, prototypes, and user flows.',
          'Iterate on feedback and build high-fidelity interface design specifications.',
          'Align with engineering to ensure seamless UI integration and quality.'
        ],
        location: 'Bengaluru, Karnataka (On-site)',
        workType: 'onsite',
        employmentType: 'full-time',
        experienceLevel: 'mid',
        salaryRange: {
          min: 1400000,
          max: 2000000,
          currency: 'INR',
          isNegotiable: false
        },
        skills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Design Systems'],
        benefits: ['Free Meals', 'Cab Services', 'Health Plan', 'Wellness Reimbursements']
      },
      {
        companyId: company3._id,
        userId: recruiter3._id,
        title: 'Software Engineer (Node.js Backend)',
        description: 'Join Zomato’s core backend team to scale high-throughput food delivery ordering engines and real-time tracking services.',
        requirements: [
          '3+ years experience building RESTful APIs in Node.js/Express.',
          'Strong databases skills in MongoDB, PostgreSQL, and caching with Redis.',
          'Familiarity with event-driven architectures and message queues (RabbitMQ/Kafka).'
        ],
        responsibilities: [
          'Develop, test and scale Node.js order processing web APIs.',
          'Maintain high database performance through indexing and schema optimization.',
          'Design distributed microservices that scale under flash-sale traffic loads.'
        ],
        location: 'Gurugram, Haryana (Remote)',
        workType: 'remote',
        employmentType: 'full-time',
        experienceLevel: 'mid',
        salaryRange: {
          min: 1200000,
          max: 1800000,
          currency: 'INR',
          isNegotiable: true
        },
        skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],
        benefits: ['Remote Work Stipend', 'Health Cover', 'Gym Membership', 'Unlimited Leave Policy']
      },
      {
        companyId: company4._id,
        userId: recruiter4._id,
        title: 'Java Backend Intern',
        description: 'TCS is hiring a Java Backend Intern to work on global enterprise banking platform integrations.',
        requirements: [
          'Final year student in Computer Science or related engineering stream.',
          'Familiarity with object-oriented programming in Java and relational database concepts.',
          'Good logical reasoning and problem-solving skills.'
        ],
        responsibilities: [
          'Assist in coding, debugging, and testing backend Java modules.',
          'Write SQL queries and document database schemas.',
          'Collaborate with developers to deliver banking modules on schedule.'
        ],
        location: 'Pune, Maharashtra (On-site)',
        workType: 'onsite',
        employmentType: 'internship',
        experienceLevel: 'entry',
        salaryRange: {
          min: 400000,
          max: 600000,
          currency: 'INR',
          isNegotiable: false
        },
        skills: ['Java', 'Spring Boot', 'SQL', 'Git'],
        benefits: ['Internship Certificate', 'Paid Leave', 'Pre-Placement Offer Opportunity']
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Indian companies and jobs seeded successfully in live MongoDB Atlas!'
    });
  } catch (err) {
    next(err);
  }
});

// API routes
router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/saved-jobs', savedJobRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;

