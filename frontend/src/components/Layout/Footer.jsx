import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Task Tracker</h3>
            <p className="text-gray-400">Stay organized. Get things done.</p>
          </div>
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Task Tracker. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;