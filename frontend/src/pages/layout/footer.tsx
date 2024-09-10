import React, { FC } from 'react';
import './index.less';
import { Layout } from 'antd';

const { Footer } = Layout;

const FooterComponent: FC /*<HeaderProps> */ = () => {
  return (
    <Layout>
      <Footer className="footer">
          <div className="footer-content">
              <p>&copy; {new Date().getFullYear()} INSURANCE</p>
          </div>
      </Footer>
    </Layout>
  );
};

export default FooterComponent;
