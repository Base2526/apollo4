import type { FC, ReactElement } from 'react';
import type { RouteProps } from 'react-router';

import { useIntl } from 'react-intl';

import PrivateRoute from './privateRoute';

export interface WrapperRouteProps extends RouteProps {
  /** document title locale id */
  titleId: string;
  /** authorization？ */
  requireAuth?: boolean;
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ titleId, requireAuth, ...props }) => {
  const { formatMessage } = useIntl();

  if (titleId) {
    document.title = formatMessage({
      id: titleId,
    });
  }

  return requireAuth ? <PrivateRoute {...props} /> : (props.element as ReactElement);
};

export default WrapperRouteComponent;
