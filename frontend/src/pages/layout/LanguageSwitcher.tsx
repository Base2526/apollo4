import React, { FC, useState } from 'react';
// import ThailandFlag from './ThailandFlag'; // Adjust the path as necessary
// import EnglandFlag from './EnglandFlag'; // Adjust the path as necessary
import { useSelector } from 'react-redux';

import { ReactComponent as EnglandFlag } from '@/assets/header/en_US.svg';
// import { ReactComponent as LanguageSvg } from '@/assets/header/language.svg';
// import { ReactComponent as MoonSvg } from '@/assets/header/moon.svg';
// import { ReactComponent as SunSvg } from '@/assets/header/sun.svg';
import { ReactComponent as ThailandFlag } from '@/assets/header/zh_CN.svg';

const LanguageSwitcher: FC = () => {
//   const [language, setLanguage] = useState<'en' | 'th'>('en');

  const { logged, locale, device } = useSelector(state => state.user);

  const { theme } = useSelector(state => state.global);

//   const toggleLanguage = () => {
//     setLanguage((prev) => (prev === 'en' ? 'th' : 'en'));
//   };

  return (
    <div  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      {locale === 'en_US' ? <EnglandFlag /> : <ThailandFlag />}
      <span style={{ marginLeft: 8, color: theme === 'dark' ? '#FFFFFF': '#333333' }}>{locale === 'en_US' ? 'English' : 'ภาษาไทย'}</span>
    </div>
  );
};

export default LanguageSwitcher;
