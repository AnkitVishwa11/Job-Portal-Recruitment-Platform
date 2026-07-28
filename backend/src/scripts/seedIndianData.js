require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.production') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await connectDB();
    console.log('Database connected successfully!');

    // Clean existing collection to start clean
    console.log('Cleaning existing Jobs and Companies...');
    await Job.deleteMany({});
    await Company.deleteMany({});
    console.log('Collections cleaned.');

    // 1. Create or Find Recruiter User
    let recruiter = await User.findOne({ email: 'recruiter@example.com' });
    if (!recruiter) {
      console.log('Creating default recruiter user...');
      recruiter = await User.create({
        firstName: 'Aravind',
        lastName: 'Sharma',
        email: 'recruiter@example.com',
        password: 'Password123!',
        role: 'recruiter',
        phone: '9876543210'
      });
      console.log('Default recruiter created.');
    } else {
      console.log('Default recruiter user found.');
    }

    // 2. Create Companies
    console.log('Creating Indian companies...');
    const createdCompanies = [];

    // Company 1: Razorpay (Recruiter 1)
    const company1 = await Company.create({
      userId: recruiter._id,
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
    createdCompanies.push(company1);

    // Let's create Recruiter 2 for Flipkart
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
    createdCompanies.push(company2);

    // Let's create Recruiter 3 for Zomato
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
    createdCompanies.push(company3);

    // Let's create Recruiter 4 for TCS
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
    createdCompanies.push(company4);

    console.log('Companies created successfully.');

    // 3. Create Jobs
    console.log('Creating Indian job postings...');
    await Job.create([
      {
        companyId: company1._id,
        userId: recruiter._id,
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

    console.log('Indian job postings seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed with error:', err.message);
    process.exit(1);
  }
};

seedData();
