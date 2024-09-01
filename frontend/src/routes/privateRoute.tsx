import React, { FC, useEffect } from 'react';
import type { RouteProps } from 'react-router';

import { Button, Result } from 'antd';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { useLocale } from '@/locales';

import * as utils from "../utils"
import * as Constants from "../constants"

export interface WrapperRouteProps extends RouteProps {
  /** document title locale id */
  titleId: string;
  /** authorization？ */
  requireAuth?: boolean;

  isAdmin?: boolean
}

const PrivateRoute: FC<WrapperRouteProps> = (props) => {
  const { logged, profile } = useSelector(state => state.user);
  const navigate = useNavigate();
  const { formatMessage } = useLocale();
  const location = useLocation();

  let { titleId, requireAuth, isAdmin } = props

  // console.log("PrivateRoute :", titleId, requireAuth, isAdmin)

  if( isAdmin && utils.checkRole(profile) === Constants.ADMINISTRATOR ){
    return (props.element as React.ReactElement)
  }else if(logged && !isAdmin){
    return (props.element as React.ReactElement)
  }else{
    return  <Result
              status="403"
              title="403"
              subTitle={formatMessage({ id: 'gloabal.tips.unauthorized' })}
              extra={
                <Button
                  type="primary"
                  onClick={() => navigate(`/${'?from=' + encodeURIComponent(location.pathname)}`, { replace: true })}
                >
                  {formatMessage({ id: 'gloabal.tips.goToHome' })}
                </Button>
              }
            />
  }

  return logged ? (
    (props.element as React.ReactElement)
  ) : (
    <Result
      status="403"
      title="403"
      subTitle={formatMessage({ id: 'gloabal.tips.unauthorized' })}
      extra={
        <Button
          type="primary"
          onClick={() => navigate(`/login${'?from=' + encodeURIComponent(location.pathname)}`, { replace: true })}
        >
          {formatMessage({ id: 'gloabal.tips.goToLogin' })}
        </Button>
      }
    />
  );
};

export default PrivateRoute;
