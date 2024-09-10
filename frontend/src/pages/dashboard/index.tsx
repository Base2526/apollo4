import '@/pages/dashboard/index.less';

import React, { FC } from 'react';
import { useEffect, useState } from 'react';

import Overview from '@/pages/dashboard/overview';
import SalePercent from '@/pages/dashboard/salePercent';
import TimeLine from '@/pages/dashboard/timeLine';

const DashBoardPage: FC = () => {
  const [loading, setLoading] = useState(true);

  // mock timer to mimic dashboard data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(undefined as any);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div>
      <Overview loading={loading} />
      <SalePercent loading={loading} />
      <TimeLine loading={loading} />
    </div>
  );
};

export default DashBoardPage;
