import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <span className="text-sm font-medium text-gray-700">DevForge</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500">
              © {currentYear} HimalayanCoder (Nitin Rana)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 