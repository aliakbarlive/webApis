import React from 'react';
import { MenuAlt2Icon } from '@heroicons/react/outline';

const MobileMenuButton = ({ setMobileMenuOpen }) => {
  return (
    <button
      type="button"
      className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 md:hidden"
      onClick={() => setMobileMenuOpen(true)}
    >
      <span className="sr-only">Open sidebar</span>
      <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
};

export default MobileMenuButton;
