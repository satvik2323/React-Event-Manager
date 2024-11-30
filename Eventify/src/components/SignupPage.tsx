import React, { useState } from 'react';
import SignupStepOne from './SignupStepOne';
import SignupStepTwo from './SignupStepTwo';
import Layout from './Layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    birthDate: '',
    pan: '',
  });

  const handleNext = () => {
    setStep(2);
  };

  const handleSignup = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success('Welcome! You have signed up successfully.');
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <Layout>
      {step === 1 ? (
        <SignupStepOne onNext={handleNext} formData={formData} setFormData={setFormData} />
      ) : (
        <SignupStepTwo onSignup={handleSignup} formData={formData} setFormData={setFormData} />
      )}
      <ToastContainer />
    </Layout>
  );
};

export default SignupPage;
