import React from 'react';
import Calculator from '../components/home/Calculator';
import ChartSection from '../components/home/ChartSection';

const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row bg-[#F8F8F8] min-h-[100vh]">
      <Calculator />
      <div className="flex-1">
        {/* <ChartSection /> */}
      </div>
    </div>
  );
};

export default HomePage;