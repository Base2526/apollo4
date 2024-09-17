import React, { FC } from 'react';
import { Switch, SwitchProps } from 'antd';

interface BaseSwitchProps extends SwitchProps {
  children?: React.ReactNode;
}

const BaseSwitch: FC<BaseSwitchProps> = ({ children: _, ...props }) => {
  return <Switch {...props} />;
};

const MySwitch = Object.assign(Switch, BaseSwitch);

export default MySwitch;