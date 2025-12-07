import React, { useState } from 'react';
import '../styles/DogForm.css';

const DogForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    dogName: '',
    breed: '',
    size: 'medium',
    age: '',
    weight: '',
  });

  const [errors, setErrors] = useState({});

  const breeds = [
    'Labrador',
    'Golden Retriever',
    'German Shepherd',
    'Bulldog',
    'Poodle',
    'Beagle',
    'Yorkshire Terrier',
    'Dachshund',
    'Boxer',
    'Husky',
    'Chihuahua',
    'Schnauzer',
    'Dalmatian',
    'Other',
  ];

  const sizes = ['small', 'medium', 'large', 'extra-large'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.dogName.trim()) {
      newErrors.dogName = 'Dog name is required';
    }

    if (!formData.breed) {
      newErrors.breed = 'Breed is required';
    }

    if (!formData.age || formData.age <= 0) {
      newErrors.age = 'Please enter a valid age';
    }

    if (formData.age > 30) {
      newErrors.age = 'Age seems too high. Please check.';
    }

    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="dog-form-container">
      <h2 className="form-title">Tell Us About Your Dog 🐕</h2>

      <form onSubmit={handleSubmit} className="dog-form">
        <div className="form-group">
          <label htmlFor="dogName">Dog's Name *</label>
          <input
            type="text"
            id="dogName"
            name="dogName"
            value={formData.dogName}
            onChange={handleChange}
            placeholder="e.g., Max"
            className={errors.dogName ? 'input-error' : ''}
          />
          {errors.dogName && <span className="error-text">{errors.dogName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="breed">Breed *</label>
            <select
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              className={errors.breed ? 'input-error' : ''}
            >
              <option value="">Select a breed</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
            {errors.breed && <span className="error-text">{errors.breed}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="size">Size *</label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
            >
              {sizes.map((sizeOption) => (
                <option key={sizeOption} value={sizeOption}>
                  {sizeOption.charAt(0).toUpperCase() + sizeOption.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">Age (years) *</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g., 5"
              min="0"
              max="30"
              step="0.1"
              className={errors.age ? 'input-error' : ''}
            />
            {errors.age && <span className="error-text">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight (kg) *</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g., 25"
              min="0"
              max="100"
              step="0.1"
              className={errors.weight ? 'input-error' : ''}
            />
            {errors.weight && <span className="error-text">{errors.weight}</span>}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Get Health Insights
        </button>
      </form>
    </div>
  );
};

export default DogForm;
