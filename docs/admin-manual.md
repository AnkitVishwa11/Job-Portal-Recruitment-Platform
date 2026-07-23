# Job Portal - Admin Manual

## Overview

The Administrator role has full access to all system features. This manual covers the admin dashboard, user management, job oversight, and reporting capabilities.

## Accessing Admin Features

1. Log in with an admin account
2. Navigate to the Admin Dashboard from the navigation bar
3. Or go directly to `/admin/dashboard`

## Admin Dashboard

### Dashboard Metrics

- **Total Users**: All registered users across all roles
- **Active Jobs**: Currently open job listings
- **Total Applications**: All submitted applications
- **New Users Today**: Users registered in the last 24 hours
- **Total Companies**: Registered company profiles
- **Pending Verifications**: Companies awaiting verification

### Recent Activities

- **Newly Registered Users**: Latest 5 user registrations
- **Latest Job Postings**: Most recent 5 job listings
- **Recent Applications**: Latest 5 applications submitted

## User Management

### Viewing Users

1. Navigate to "Manage Users" from the admin dashboard
2. Filter users by:
   - Role (Admin, Recruiter, Job Seeker)
   - Status (Active, Inactive)
   - Search by name or email
3. View user details by clicking on a user

### User Actions

For each user, admins can:

1. **Toggle Status**: Activate or deactivate user accounts
   - Deactivated users cannot log in
   - Their listings/applications remain but are hidden
2. **Change Role**: Modify user role (e.g., jobseeker → recruiter)
   - Use with caution - affects permissions
3. **Delete User**: Permanently remove user and their data
   - Associated jobs and applications will be removed
   - This action is irreversible

### Managing Applications

1. View all applications across the platform
2. Filter by status, job, or date
3. Monitor application activity
4. Admin cannot change application status (that's the recruiter's role)

### Managing Jobs

1. View all job listings across all recruiters
2. Filter by status (open, closed, draft), company, or recruiter
3. Admin can close or delete any job listing
4. Monitor job posting activity

## Reports

### Accessing Reports

Navigate to "Reports" from the admin dashboard.

### Available Reports

1. **Users Report**
   - Total registrations over time
   - Registration by role
   - Active vs inactive users
   - New users per day/week/month

2. **Jobs Report**
   - Jobs posted over time
   - Jobs by status
   - Jobs by company
   - Average applications per job

3. **Applications Report**
   - Applications over time
   - Application status distribution
   - Applications by job
   - Conversion rates (applied → shortlisted → hired)

4. **Companies Report**
   - Companies registered over time
   - Companies by industry
   - Verified vs unverified companies

### Export Reports

Reports can be exported as:
- CSV
- JSON
- PDF

## System Configuration

### Security Settings

- Password policy (minimum length, complexity)
- Session timeout
- Login attempt limits

### Notification Settings

- Email notification templates
- In-app notification settings

## Best Practices

1. **Regular Monitoring**: Check the dashboard daily for unusual activity
2. **User Verification**: Verify new recruiter companies before activation
3. **Content Moderation**: Review job listings for compliance
4. **Data Cleanup**: Archive or delete inactive accounts periodically
5. **Backup**: Ensure regular database backups are configured
6. **Audit Trail**: Keep logs of admin actions for accountability

## Troubleshooting

### User Issues

**Problem**: User cannot log in
**Solution**: Check if account is active, reset password if needed

**Problem**: User reports missing data
**Solution**: Check user profile, application, and job records

### System Issues

**Problem**: Slow performance
**Solution**: Check server resources, clear cache, optimize queries

**Problem**: File upload failures
**Solution**: Check disk space, upload directory permissions


