
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfilePage.css";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [position, setPosition] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("profileData") || "{}"
      );

      setFirstName(saved.firstName || "");
      setLastName(saved.lastName || "");
      setDob(saved.dob || "");
      setPosition(saved.position || "");
      setAddress(saved.address || "");
      setProfilePic(saved.profilePic || "");
    } catch {
      console.error("Unable to load profile data");
    }
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePic(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowUpdateModal(true);
  };

  const handleConfirmUpdate = () => {
    const profileData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dob,
      position,
      address: address.trim(),
      profilePic,
    };

    try {
      localStorage.setItem(
        "profileData",
        JSON.stringify(profileData)
      );

      setShowUpdateModal(false);
      setShowSuccessModal(true);
    } catch {
      alert("Unable to save profile. The image may be too large.");
      setShowUpdateModal(false);
    }
  };

  const handleSuccess = () => {
    setShowSuccessModal(false);
    navigate("/my-profile");
  };

  return (
    <div className="edit-profile-page">

      {/* Header */}
      <header className="edit-header">
        <button
          className="edit-back-btn"
          onClick={() => navigate(-1)}
        >
          ‹-
        </button>

        <h1>Personal Data</h1>

        <span className="edit-header-space" />
      </header>

      <main className="edit-profile-container">

        <div className="edit-form-card">

          <div className="form-heading">
            <h2>Personal Information</h2>
            <p>Keep your profile information up to date.</p>
          </div>

          {/* Profile Image */}
          <div className="profile-upload-section">
            <div className="profile-image-wrapper">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="profile-preview"
                />
              ) : (
                <div className="profile-placeholder">
                  👤
                </div>
              )}
            </div>

            <h3>{firstName || "Your Name"}</h3>
            <p>Upload or update your profile photo</p>

            <label
              htmlFor="profile-upload"
              className="upload-btn"
            >
              📷 Change Photo
            </label>

            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
          </div>

          <form onSubmit={handleSubmit}>

            <div className="edit-form-section">
              <h3>Basic Information</h3>

              <div className="form-grid">

                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="position">Role</label>
                  <select
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Data Analyst">Data Analyst</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="edit-form-section">
              <h3>Contact Information</h3>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  placeholder="Enter your full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="4"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button type="submit" className="update-btn">
                Update Profile →
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">?</div>

            <h2>Confirm Update</h2>

            <p>
              Are you sure you want to save your profile changes?
            </p>

            <div className="modal-actions">
              <button
                className="modal-cancel-btn"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>

              <button
                className="modal-confirm-btn"
                onClick={handleConfirmUpdate}
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="success-icon">✓</div>

            <h2>Profile Updated!</h2>

            <p>
              Your profile information has been updated successfully.
            </p>

            <button
              className="success-btn"
              onClick={handleSuccess}
            >
              View Profile
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default EditProfilePage;
