import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} CampSync.AI. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link to="/Privacy" className="hover:text-white transition duration-300">Privacy Policy</Link>
            <Link to="/Terms" className="hover:text-white transition duration-300">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition duration-300">Contact Us</Link>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
