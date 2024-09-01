import type { FC, ReactElement } from 'react';
import type { RouteProps } from 'react-router';

import { useIntl } from 'react-intl';

import PrivateRoute from './privateRoute';

export interface WrapperRouteProps extends RouteProps {
  /** document title locale id */
  titleId: string;
  /** authorization？ */
  requireAuth?: boolean;

  isAdmin?: boolean
}
// 

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
