import './index.less';

import React, { FC } from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const RoutePermissionPage: FC = () => {
  const { t } = useTranslation();
  return (
    <div className="permission-page">
      <Typography className="permission-intro">
        {t('loginResult')}
      </Typography>
    </div>
  );
};

export default RoutePermissionPage;