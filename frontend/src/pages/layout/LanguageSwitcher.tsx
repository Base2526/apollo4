import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ReactComponent as EnglandFlag } from '@/assets/header/en_US.svg';
import { ReactComponent as ThailandFlag } from '@/assets/header/zh_CN.svg';
import  { DefaultRootState } from '@/interface/DefaultRootState';


const LanguageSwitcher: FC = () => {
  const { theme } = useSelector((state: DefaultRootState )=> state.global);
  const { i18n } = useTranslation();

  return (
    <div  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      {i18n.language === 'en_US' ? <EnglandFlag /> : <ThailandFlag />}
      <span style={{ marginLeft: 8, color: theme === 'dark' ? '#FFFFFF': '#333333' }}>{i18n.language === 'en_US' ? 'English' : 'ภาษาไทย'}</span>
    </div>
  );
};

export default LanguageSwitcher;
