import React, { FC } from 'react';
import type { ColProps } from 'antd/es/col';
import { Badge, Card, Col, List, Radio, Row } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { useLocale } from '@/locales';
import type { UserState } from '@/interface/user/user';

type DataType = 'all' | 'online' | 'offline';
interface Values {
  name: {
    zh_CN: string;
    en_US: string;
    th_TH: string;
  };
  value: number;
}

interface Data {
  all: Values[];
  online: Values[];
  offline: Values[];
}

const data: Data = {
  all: [
    { name: { zh_CN: '家用电器', en_US: 'appliances', th_TH: 'appliances' }, value: 4544 },
    { name: { zh_CN: '食用酒水', en_US: 'drinks', th_TH: 'drinks' }, value: 3321 },
    { name: { zh_CN: '个护健康', en_US: 'health', th_TH: 'health' }, value: 3113 },
    { name: { zh_CN: '服饰箱包', en_US: 'clothing', th_TH: 'clothing'  }, value: 2341 },
    { name: { zh_CN: '母婴产品', en_US: 'baby', th_TH: 'baby' }, value: 1231 },
    { name: { zh_CN: '其他', en_US: 'others', th_TH: 'others' }, value: 132 },
  ],
  online: [
    { name: { zh_CN: '家用电器', en_US: 'appliances', th_TH: 'appliances' }, value: 244 },
    { name: { zh_CN: '食用酒水', en_US: 'drinks', th_TH: 'drinks' }, value: 231 },
    { name: { zh_CN: '个护健康', en_US: 'health', th_TH: 'health' }, value: 311 },
    { name: { zh_CN: '服饰箱包', en_US: 'clothing', th_TH: 'clothing' }, value: 41 },
    { name: { zh_CN: '母婴产品', en_US: 'baby', th_TH: 'baby' }, value: 121 },
    { name: { zh_CN: '其他', en_US: 'others', th_TH: 'others' }, value: 111 },
  ],
  offline: [
    { name: { zh_CN: '家用电器', en_US: 'appliances', th_TH: 'appliances' }, value: 99 },
    { name: { zh_CN: '食用酒水', en_US: 'drinks', th_TH: 'drinks' }, value: 188 },
    { name: { zh_CN: '个护健康', en_US: 'health', th_TH: 'health' }, value: 344 },
    { name: { zh_CN: '服饰箱包', en_US: 'clothing', th_TH: 'clothing' }, value: 255 },
    { name: { zh_CN: '其他', en_US: 'others', th_TH: 'others' }, value: 65 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#E36E7E', '#8F66DE'];

const wrapperCol: ColProps = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 12,
};

const SalePercent: FC<{ loading: boolean }> = ({ loading }) => {
  const [dataType, setDataType] = useState<DataType>('all');
  const { locale } = useSelector((state:{user: UserState}) => state.user);
  const { formatMessage } = useLocale();

  return (
    <Card
      className="salePercent"
      title={formatMessage({ id: 'app.dashboard.salePercent.proportionOfSales' })}
      loading={loading}
      extra={
        <Radio.Group value={dataType} onChange={e => setDataType(e.target.value)} buttonStyle="solid">
          <Radio.Button value="all">{formatMessage({ id: 'app.dashboard.salePercent.all' })}</Radio.Button>
          <Radio.Button value="online">{formatMessage({ id: 'app.dashboard.salePercent.online' })}</Radio.Button>
          <Radio.Button value="offline">{formatMessage({ id: 'app.dashboard.salePercent.offline' })}</Radio.Button>
        </Radio.Group>
      }
    >
      <Row gutter={20}>
        <Col {...wrapperCol}>
          <ResponsiveContainer height={250}>
            <PieChart>
              <Tooltip
                content={({ active, payload }: any) => {
                  if (active) {
                    const { name, value } = payload[0];
                    const total = data[dataType].map(d => d.value).reduce((a, b) => a + b);
                    const percent = ((value / total) * 100).toFixed(2) + '%';

                    return (
                      <span className="customTooltip">
                        {name[locale]} : {percent}
                      </span>
                    );
                  }

                  return null;
                }}
              />
              <Pie
                strokeOpacity={0}
                data={data[dataType]}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data[dataType].map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Col>
        <Col {...wrapperCol}>
          <List<Values>
            bordered
            dataSource={data[dataType]}
            renderItem={(item, index) => {
              const total = data[dataType].map(d => d.value).reduce((a, b) => a + b);
              const percent = ((item.value / total) * 100).toFixed(2) + '%';

              return (
                <List.Item>
                  <Badge color={COLORS[index]} />
                  {/* <span>{item.name[locale]}</span>  */}
                  <span>{item.name[locale as keyof typeof item.name] || 'Default value'}</span>| <span>{item.value}</span> <span>¥ {percent}</span>
                </List.Item>
              );
            }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default SalePercent;
