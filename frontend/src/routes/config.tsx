import React, { FC, ReactElement } from 'react';
import { PathRouteProps, LayoutRouteProps, IndexRouteProps } from 'react-router-dom';
import { useIntl } from 'react-intl';

import PrivateRoute from '@/routes/privateRoute';

type RouteProps = PathRouteProps | LayoutRouteProps | IndexRouteProps;

export type WrapperRouteProps = RouteProps & {
  /** document title locale id */
  titleId: string;
  /** authorization? */
  requireAuth?: boolean;
  /** isAdmin? */
  isAdmin?: boolean;
};

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ titleId, requireAuth, isAdmin=false, ...props }) => {
  const { formatMessage } = useIntl();
  if (titleId) {
    document.title = formatMessage({
      id: titleId,
    });
  }

  return requireAuth ? <PrivateRoute titleId={titleId} requireAuth={requireAuth} isAdmin={isAdmin} {...props} /> : (props.element as ReactElement);
};

export default WrapperRouteComponent;
