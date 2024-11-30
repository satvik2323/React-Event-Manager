import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface SignupStepOneProps {
  onNext: () => void;
  formData: any;
  setFormData: (data: any) => void;
}

const SignupStepOne: React.FC<SignupStepOneProps> = ({ onNext, formData, setFormData }) => {
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
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
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="block w-full p-2 mb-2 border"
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="block w-full p-2 mb-2 border"
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
        </div>
      </div>
      <div>
        <input
          type="email"
          placeholder="Email Id"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="block w-full p-2 mb-2 border"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="block w-full p-2 mb-2 border"
        />
        <span
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </span>
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>
      <button onClick={handleNext} className="bg-black text-white p-2 mt-4 w-full">Next Step</button>
      <p className="text-center mt-4">
        Already registered? <Link to="/login" className="text-blue-500">Login</Link>
      </p>
    </div>
  );
};

export default SignupStepOne;
