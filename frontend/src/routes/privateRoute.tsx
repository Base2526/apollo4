import React, { FC } from 'react';
import { PathRouteProps, LayoutRouteProps, IndexRouteProps } from 'react-router-dom';

import { Button, Result } from 'antd';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useLocale } from '@/locales';
import * as utils from "@/utils"
import * as Constants from "@/constants"
import  { DefaultRootState } from '@/interface/DefaultRootState';

type RouteProps = PathRouteProps | LayoutRouteProps | IndexRouteProps;

export type WrapperRouteProps = RouteProps & {
  /** document title locale id */
  titleId: string;
  /** authorization? */
  requireAuth?: boolean;
  /** isAdmin? */
  isAdmin?: boolean;
};

const PrivateRoute: FC<WrapperRouteProps> = (props) => {
  const { logged, profile } = useSelector((state: DefaultRootState) => state.user);
  const navigate = useNavigate();
  const { formatMessage } = useLocale();
  const location = useLocation();
  const { t } = useTranslation();

  let { titleId, requireAuth, isAdmin } = props

  if( isAdmin && utils.checkRole(profile) === Constants.ADMINISTRATOR ){
    return (props.element as React.ReactElement)
  }else if(logged && !isAdmin){
    return (props.element as React.ReactElement)
  }else{
    return  <Result
              status="403"
              title="403"
              subTitle={ /*formatMessage({ id: 'gloabal.tips.unauthorized' })*/ t('unauthorized')}
              extra={
                <Button
                  type="primary"
                  onClick={() => navigate(`/${'?from=' + encodeURIComponent(location.pathname)}`, { replace: true })}
                >
                  {/* {formatMessage({ id: 'gloabal.tips.goToHome' })} */}
                  {t('goToHome')}
                </Button>
              }
            />
  }

  /*
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
  */
};

export default PrivateRoute;
