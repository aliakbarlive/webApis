import React from 'react';
import { Link } from 'react-router-dom';

const NavBtn = ({ type, children, onClick, classes }) => {
  if (type == 'link') {
    return (
      <Link
        className={`flex items-center uppercase px-2 rounded-sm py-1 rounded border border-gray-300 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-red-300 ${
          classes ?? ''
        }`}
        to="/clients/add"
      >
        {children}
      </Link>
    );
  } else if (type == 'btn') {
    return (
      <button
        className={`flex items-center uppercase px-2 rounded-sm py-1 rounded border border-gray-300 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-red-300 ${
          classes ?? ''
        }`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
};

export default NavBtn;
