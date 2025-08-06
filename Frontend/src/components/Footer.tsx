import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6">
              <img src="/logo.png?v=2" alt="DevForge Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-medium text-gray-700">DevForge</span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>© {currentYear} HimalayanCoder</span>
            <span>•</span>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 