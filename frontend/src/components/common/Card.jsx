import React from 'react';

const Card = ({ children, className = '' }) => {
  console.log(children);
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 w-full min-w-0 ${className}`}
         >
      {children}
    </div>
  );
};
export default Card;