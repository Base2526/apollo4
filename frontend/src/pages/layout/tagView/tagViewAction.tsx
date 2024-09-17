import React, { FC } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { removeAllTag, removeOtherTag, removeTag } from '@/action/tags-view.store';
import  { DefaultRootState } from '@/interface/DefaultRootState';

const TagsViewAction: FC = () => {
  const { activeTagId } = useSelector((state :DefaultRootState ) => state.tagsView);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: '0',
            onClick: () => dispatch(removeTag(activeTagId)),
            label: t('closeCurrent'),
          },
          {
            key: '1',
            onClick: () => dispatch(removeOtherTag()),
            label: t('closeOther'),
          },
          {
            key: '2',
            onClick: () => dispatch(removeAllTag()),
            label: t('closeAll'),
          },
          {
            key: '3',
            type: 'divider',
          },
          {
            key: '4',
            onClick: () => dispatch(removeOtherTag()),
            label: t('dashboard'),
          },
        ],
      }}
    >
      <span id="pageTabs-actions">
        <SettingOutlined className="tagsView-extra" />
      </span>
    </Dropdown>
  );
};

export default TagsViewAction;
