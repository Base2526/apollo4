import React, { FC } from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

const div = <div style={{ height: 200 }}>2333</div>;

const DocumentationPage: FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Typography className="innerText">
        <Title>
          {t('title')}
        </Title>
        <Paragraph>
          {t('description')}
        </Paragraph>
        <Title>
          {t('title')}
        </Title>
        <Paragraph>
          {t('description')}
        </Paragraph>
        <Paragraph>
          <ul>
            <li>
              <a href="#layout">
                {t('layout')}
              </a>
            </li>
            <li>
              <a href="#routes">
                {t('routes')}
              </a>
            </li>
            <li>
              <a href="#request">
                {t('request')}
              </a>
            </li>
            <li>
              <a href="#theme">
                {t('theme')}
              </a>
            </li>
            <li>
              <a href="#typescript">
                {t('typescript')}
              </a>
            </li>
            <li>
              <a href="#international">
                {t('international')}
              </a>
            </li>
          </ul>
        </Paragraph>
        <Title id="layout" level={2}>
          {t('layout')}
        </Title>
        <Paragraph>{div}</Paragraph>
        <Title id="routes" level={2}>
          {t('routes')}
        </Title>
        <Paragraph>{div}</Paragraph>
        <Title id="request" level={2}>
          {t('request')}
        </Title>
        <Paragraph>{div}</Paragraph>
        <Title id="theme" level={2}>
          {t('theme')}
        </Title>
        <Paragraph>{div}</Paragraph>
        <Title id="typescript" level={2}>
          {t('typescript')}
        </Title>
        <Paragraph>{div}</Paragraph>
        <Title id="international" level={2}>
          {t('international')}
        </Title>
        <Paragraph>{div}</Paragraph>
      </Typography>
    </div>
  );
};

export default DocumentationPage;
