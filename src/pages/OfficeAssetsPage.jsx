
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OfficeAssetsPage.css";

const emptyAsset = {
  assetName: "",
  brand: "",
  warrantyStatus: "",
  buyingDate: "",
  receivedOn: "",
  assetImage: ""
};

const OfficeAssetsPage = () => {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [asset, setAsset] = useState(emptyAsset);

  const [showForm, setShowForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load saved assets
  useEffect(() => {
    try {
      const savedAssets = JSON.parse(
        localStorage.getItem("officeAssets") || "null"
      );

      if (Array.isArray(savedAssets)) {
        setAssets(savedAssets);
      } else {
        // Support previously saved single asset
        const oldAsset = JSON.parse(
          localStorage.getItem("officeAssetData") || "null"
        );

        if (oldAsset && oldAsset.assetName) {
          const migratedAsset = {
            ...oldAsset,
            id: Date.now()
          };

          setAssets([migratedAsset]);

          localStorage.setItem(
            "officeAssets",
            JSON.stringify([migratedAsset])
          );

          localStorage.removeItem("officeAssetData");
        }
      }
    } catch {
      console.error("Unable to load office assets");
    }
  }, []);

  // Input changes
  const handleChange = (e) => {
    setAsset(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setAsset(prev => ({
        ...prev,
        assetImage: reader.result
      }));
    };

    reader.readAsDataURL(file);
  };

  // Remove image
  const handleRemoveImage = () => {
    setAsset(prev => ({
      ...prev,
      assetImage: ""
    }));
  };

  // Open new asset form
  const handleAddNew = () => {
    setAsset(emptyAsset);
    setShowForm(true);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  // Confirm and save new asset
  const handleConfirmSave = () => {
    try {
      const newAsset = {
        ...asset,
        id: Date.now()
      };

      const updatedAssets = [newAsset, ...assets];

      localStorage.setItem(
        "officeAssets",
        JSON.stringify(updatedAssets)
      );

      setAssets(updatedAssets);

      setShowConfirmModal(false);
      setShowForm(false);
      setAsset(emptyAsset);
      setShowSuccessModal(true);

    } catch {
      alert("Unable to save. Please try a smaller image.");
    }
  };

  // Delete asset
  const handleDeleteAsset = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this asset?"
    );

    if (!confirmDelete) return;

    const updatedAssets = assets.filter(
      item => item.id !== id
    );

    try {
      localStorage.setItem(
        "officeAssets",
        JSON.stringify(updatedAssets)
      );

      setAssets(updatedAssets);
    } catch {
      alert("Unable to delete asset.");
    }
  };

  return (
    <div className="office-assets-page">

      {/* Header */}
      <header className="assets-header">
        <button
          className="assets-back-btn"
          onClick={() => navigate(-1)}
          type="button"
        >
          ←
        </button>

        <h1>Office Assets</h1>

        <div className="assets-header-space"></div>
      </header>

      <main className="assets-main-content">

        {/* Heading */}
        <div className="assets-page-heading">
          <h2>My Office Assets</h2>
          <p>View and manage your assigned office equipment.</p>
        </div>

        {/* ================= ASSET LIST ================= */}

        {!showForm && (
          <div className="saved-assets-section">

            <div className="saved-assets-header">
              <div>
                <h3>My Assets</h3>
                <p>{assets.length} assets added</p>
              </div>

              <button
                className="add-new-asset-btn"
                onClick={handleAddNew}
                type="button"
              >
                + Add New Asset
              </button>
            </div>

            {assets.length === 0 ? (
              <div className="assets-empty-state">
                <div className="assets-empty-icon">💻</div>
                <h3>No Assets Added Yet</h3>
                <p>
                  You haven't added any office assets.
                  Click the button below to add your first asset.
                </p>

                <button
                  className="add-new-asset-btn"
                  onClick={handleAddNew}
                  type="button"
                >
                  + Add Your First Asset
                </button>
              </div>
            ) : (
              <div className="saved-assets-grid">

                {assets.map((item) => (
                  <div className="saved-asset-card" key={item.id}>

                    <div className="saved-asset-image">
                      {item.assetImage ? (
                        <img
                          src={item.assetImage}
                          alt={item.assetName}
                        />
                      ) : (
                        <span>💻</span>
                      )}
                    </div>

                    <div className="saved-asset-details">

                      <h3>{item.assetName}</h3>

                      <p>
                        <strong>Brand:</strong> {item.brand}
                      </p>

                      <p>
                        <strong>Warranty:</strong>
                        <span className={
                          item.warrantyStatus === "Under Warranty"
                            ? "warranty-active"
                            : "warranty-expired"
                        }>
                          {item.warrantyStatus}
                        </span>
                      </p>

                      <p>
                        <strong>Buying Date:</strong> {item.buyingDate}
                      </p>

                      <p>
                        <strong>Received On:</strong> {item.receivedOn}
                      </p>

                      <button
                        type="button"
                        className="delete-asset-btn"
                        onClick={() => handleDeleteAsset(item.id)}
                      >
                        Delete Asset
                      </button>

                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>
        )}

        {/* ================= ADD ASSET FORM ================= */}

        {showForm && (
          <form onSubmit={handleSubmit}>

            <div className="assets-card">

              <div className="assets-section-heading">
                <span className="assets-heading-icon">💻</span>

                <div>
                  <h3>Add New Asset</h3>
                  <p>Enter your assigned asset details.</p>
                </div>
              </div>

              {/* Image Upload */}
              <div className="asset-upload-section">

                <label className="asset-upload-label">
                  Asset Image
                </label>

                <div className="asset-image-box">

                  {asset.assetImage ? (
                    <div className="asset-preview-wrapper">
                      <img
                        src={asset.assetImage}
                        alt="Office Asset"
                        className="asset-preview-image"
                      />

                      <button
                        type="button"
                        className="asset-remove-image"
                        onClick={handleRemoveImage}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="asset-image-empty">
                      <span className="asset-camera-icon">📷</span>
                      <h4>Upload Asset Image</h4>
                      <p>PNG, JPG or JPEG (Maximum 5MB)</p>
                    </div>
                  )}

                  <label
                    htmlFor="assetImage"
                    className="asset-image-upload-btn"
                  >
                    {asset.assetImage ? "Change Image" : "+ Choose Image"}
                  </label>

                  <input
                    id="assetImage"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageUpload}
                    hidden
                  />

                </div>
              </div>

              {/* Asset Details */}
              <div className="assets-form-grid">

                <div className="assets-form-group full-width">
                  <label>Asset Name</label>
                  <input
                    type="text"
                    name="assetName"
                    placeholder="Enter asset name"
                    value={asset.assetName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="assets-form-group full-width">
                  <label>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    placeholder="Enter brand name"
                    value={asset.brand}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="assets-form-group full-width">
                  <label>Warranty Status</label>
                  <select
                    name="warrantyStatus"
                    value={asset.warrantyStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select warranty status</option>
                    <option value="Under Warranty">Under Warranty</option>
                    <option value="Expired">Expired</option>
                    <option value="No Warranty">No Warranty</option>
                  </select>
                </div>

                <div className="assets-form-group">
                  <label>Buying Date</label>
                  <input
                    type="date"
                    name="buyingDate"
                    value={asset.buyingDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="assets-form-group">
                  <label>Received On</label>
                  <input
                    type="date"
                    name="receivedOn"
                    value={asset.receivedOn}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>
            </div>

            {/* Form Buttons */}
            <div className="assets-form-actions">

              <button
                type="button"
                className="assets-cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setAsset(emptyAsset);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="assets-save-btn"
              >
                Save Asset
              </button>

            </div>

          </form>
        )}

      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="assets-modal-overlay">
          <div className="assets-modal-box">

            <div className="assets-modal-icon">?</div>

            <h2>Confirm Save</h2>

            <p>
              Are you sure you want to save these asset details?
            </p>

            <div className="assets-modal-actions">

              <button
                type="button"
                className="assets-modal-cancel"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="assets-modal-confirm"
                onClick={handleConfirmSave}
              >
                Yes, Save
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="assets-modal-overlay">
          <div className="assets-modal-box">

            <div className="assets-success-icon">✓</div>

            <h2>Asset Saved!</h2>

            <p>
              Your office asset details have been saved successfully.
            </p>

            <button
              type="button"
              className="assets-success-btn"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default OfficeAssetsPage;
