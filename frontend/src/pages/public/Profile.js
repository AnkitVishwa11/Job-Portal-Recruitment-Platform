import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Profile = () => {
  const { user, updateProfile, changePassword, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    headline: '',
    bio: '',
    location: '',
    skills: '',
    linkedIn: '',
    website: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        headline: user.headline || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: user.skills?.join(', ') || '',
        linkedIn: user.linkedIn || '',
        website: user.website || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = {
        ...profileData,
        skills: profileData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsSaving(true);
    try {
      await changePassword(passwordData);
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="profile-page py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center text-white mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <h4 className="fw-bold mb-1">{user?.firstName} {user?.lastName}</h4>
                <p className="text-muted mb-0">{user?.email}</p>
                <span className="badge bg-primary mt-2">{user?.role}</span>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom p-0">
                <ul className="nav nav-tabs border-0">
                  <li className="nav-item">
                    <button className={`nav-link border-0 ${activeTab === 'profile' ? 'active fw-bold' : ''}`} onClick={() => setActiveTab('profile')}>
                      <i className="bi bi-person me-1"></i>Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link border-0 ${activeTab === 'password' ? 'active fw-bold' : ''}`} onClick={() => setActiveTab('password')}>
                      <i className="bi bi-shield-lock me-1"></i>Password
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body p-4">
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium">First Name</label>
                        <input type="text" className="form-control" name="firstName" value={profileData.firstName} onChange={handleProfileChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Last Name</label>
                        <input type="text" className="form-control" name="lastName" value={profileData.lastName} onChange={handleProfileChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Email</label>
                        <input type="email" className="form-control" name="email" value={profileData.email} onChange={handleProfileChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Phone</label>
                        <input type="tel" className="form-control" name="phone" value={profileData.phone} onChange={handleProfileChange} />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-medium">Headline</label>
                        <input type="text" className="form-control" name="headline" value={profileData.headline} onChange={handleProfileChange} placeholder="e.g., Senior Software Engineer at XYZ" />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-medium">Bio</label>
                        <textarea className="form-control" name="bio" rows="3" value={profileData.bio} onChange={handleProfileChange} placeholder="Tell us about yourself"></textarea>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Location</label>
                        <input type="text" className="form-control" name="location" value={profileData.location} onChange={handleProfileChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Skills (comma separated)</label>
                        <input type="text" className="form-control" name="skills" value={profileData.skills} onChange={handleProfileChange} placeholder="React, Node.js, MongoDB" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">LinkedIn URL</label>
                        <input type="url" className="form-control" name="linkedIn" value={profileData.linkedIn} onChange={handleProfileChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Website</label>
                        <input type="url" className="form-control" name="website" value={profileData.website} onChange={handleProfileChange} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button type="submit" className="btn btn-primary px-4" disabled={isSaving}>
                        {isSaving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'password' && (
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-medium">Current Password</label>
                        <input type="password" className="form-control" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">New Password</label>
                        <input type="password" className="form-control" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength={6} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Confirm New Password</label>
                        <input type="password" className="form-control" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button type="submit" className="btn btn-primary px-4" disabled={isSaving}>
                        {isSaving ? <><span className="spinner-border spinner-border-sm me-2"></span>Changing...</> : 'Change Password'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


