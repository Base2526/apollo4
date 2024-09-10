import React from 'react';
import '@/assets/styles.less';
import '@/assets/styles.css';
import image from "@/assets/logo512.png";

import ChartPage from "@/ex-chart"

const App: React.FC = () => {
  return (
    <div>
      {/* <h1>Hello, Webpack + React + TypeScript!</h1>
      <img src={image} alt="Sample" /> */}
      <ChartPage />
    </div>
  );

  
};

export default App;
