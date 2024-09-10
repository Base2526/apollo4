import React from 'react'
import { Table } from 'antd';
import dayjs from 'dayjs';
import { MyTableColumnProps, dateFormatMap, datetimeFormatMap, timeFormatMap } from '@/components/core/table-column/type';

const MyTableColumn = <RecordType extends object = object>(props: MyTableColumnProps<RecordType>) => {
  const { options, date, time, datetime, render, ...rest } = props;

  const renderContent = (value: any, record: RecordType) => {
    if (!value) return '-';

    if ('datetime' in props) {
      return dayjs(value, datetimeFormatMap[typeof datetime === 'string' ? datetime : 'second']);
    } else if ('date' in props) {
      return dayjs(value, dateFormatMap[typeof date === 'string' ? date : 'day']);
    } else if ('time' in props) {
      return dayjs(value, timeFormatMap[typeof time === 'string' ? time : 'second']);
    }

    const dataIndex = props.dataIndex;

    if (dataIndex && options) {
      // const data = options.find(item => item.value === getPathValue(record, dataIndex));
      const data = options.find(item => item );

      if (data) return data.label || '-';
    }
  };
  return <>Table</>

  // return <Table.Column {...rest} key={props.dataIndex?.toString()} render={render || renderContent} />;
};

export default MyTableColumn;
