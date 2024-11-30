import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-3xl mb-4 text-center">Welcome to Our App</h1>
      <Link to="/signup" className="bg-black text-white p-2 mt-4 inline-block w-full text-center">Sign Up</Link>
      <Link to="/login" className="bg-black text-white p-2 mt-4 inline-block w-full text-center">Log In</Link>
    </Layout>
  );
};

export default HomePage;
