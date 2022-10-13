import React from 'react';

const LowStockAlert = ({ alert }) => {
  const { title } = alert;

  return (
    <div className="p-4 border mb-2 rounded text-sm text-gray-700">
      <div className="w-full pb-3">
        <p className="font-medium">{title}</p>
      </div>
    </div>
  );
};

export default LowStockAlert;
