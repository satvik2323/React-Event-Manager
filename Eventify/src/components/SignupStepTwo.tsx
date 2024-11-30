import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface SignupStepTwoProps {
  onSignup: () => void;
  formData: any;
  setFormData: (data: any) => void;
}

const SignupStepTwo: React.FC<SignupStepTwoProps> = ({ onSignup, formData, setFormData }) => {
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (formData.address.length > 50) newErrors.address = 'Address cannot be more than 50 characters long';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 numeric digits';
    if (!/^[A-Z0-9]{10}$/.test(formData.pan)) newErrors.pan = 'PAN number must be 10 alphanumeric characters';
    if (new Date(formData.birthDate) > new Date()) newErrors.birthDate = 'Birthdate cannot be in the future';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (validate()) {
      onSignup();
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-black"></div>
        </div>
      <h2 className="text-2xl mb-4 text-center">Sign Up</h2>
      <p className="text-center mb-4">Welcome to smart investment</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="block w-full p-2 mb-2 border"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="block w-full p-2 mb-2 border"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>
      </div>
      <div>
        <input
          type="date"
          placeholder="Birthdate"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          className="block w-full p-2 mb-2 border"
        />
        {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
      </div>
      <div>
        <input
          type="text"
          placeholder="PAN Number"
          value={formData.pan}
          onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
          className="block w-full p-2 mb-2 border"
        />
        {errors.pan && <p className="text-red-500 text-sm">{errors.pan}</p>}
      </div>
      <button onClick={handleSignup} className="bg-black text-white p-2 mt-4 w-full">Sign Up</button>
      <p className="text-center mt-4">
        Already registered? <Link to="/login" className="text-blue-500">Login</Link>
      </p>
    </div>
  );
};

export default SignupStepTwo;
