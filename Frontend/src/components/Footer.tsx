import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/logo.png?v=2" alt="DevForge Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold">DevForge</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Modern Development Platform
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400">
              © {currentYear} HimalayanCoder (Nitin Rana). All Rights Reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Proprietary Software - Unauthorized use prohibited
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-4 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <div className="flex space-x-4 mb-2 md:mb-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <div>
              <span>HimalayanCoder</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 