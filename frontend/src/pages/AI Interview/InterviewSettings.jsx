import React, { useState } from 'react';

const InterviewSettings = ({ onStartInterview }) => {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role && level) {
      onStartInterview(role, level);
    } else {
      alert('Please select both a role and experience level.');
    }
  };

  return (
    <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 transform transition-all duration-300 ease-in-out">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
        Prepare for Your Interview
      </h2>
      <p className="text-center text-gray-600 mb-8 text-lg">
        Select your desired role and experience level to start a tailored mock interview.
      </p>
      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Interview Role:
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="cursor-pointer block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none pr-8 bg-white bg-no-repeat bg-[right_0.75rem_center] bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e')]"
            required
          >
            <option value="">Select a Role</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Marketing Manager">Marketing Manager</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
          </select>
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level:
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="cursor-pointer block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none pr-8 bg-white bg-no-repeat bg-[right_0.75rem_center] bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e')]"
            required
          >
            <option value="">Select Level</option>
            <option value="Junior">Junior</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
            <option value="Principal">Principal</option>
          </select>
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
        >
          Start Interview
        </button>
      </form>
    </div>
  );
};

export default InterviewSettings;