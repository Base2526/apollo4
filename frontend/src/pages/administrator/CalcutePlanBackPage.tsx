import React, { useState, useEffect } from 'react';
import { Select, Button, message } from 'antd';
import { useQuery, useMutation } from "@apollo/client";
import _ from "lodash";
import { queryMembers, mutation_calcute_plan_back } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";

import handlerError from '@/utils/handlerError';

const { Option } = Select;

interface MonthRange {
  month: string;
  startDate: Date;
  endDate: Date;
}

const getMonthsInRange = (startYear: number, endYear: number): MonthRange[] => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const dateRanges: MonthRange[] = [];
  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      dateRanges.push({
        month: `${months[month]} ${year}`,
        startDate,
        endDate,
      });
    }
  }
  return dateRanges;
};

const CalcutePlanBackPage: React.FC = (props) => {
  const [startYear, setStartYear] = useState<number>(2024);
  const [endYear, setEndYear] = useState<number>(2027);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [monthRanges, setMonthRanges] = useState<MonthRange[]>(getMonthsInRange(2024, 2027));
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<any[]>();

  const [onCalcutePlanBack] = useMutation(mutation_calcute_plan_back, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { calcute_plan_back } }) => {
      console.log("calcute_plan_back :", calcute_plan_back);
    },
    onCompleted(data) {
      console.log("calcute_plan_back onCompleted :", data);
      // let { status } = data.profile
      // if(status){
      //   message.success('Update profile success!');
      // }

      setLoading(false);
    },
    onError(error) {
      console.log("calcute_plan_back onError :", error);

      setLoading(false);
      handlerError(props, error)
    }
  });

  const { loading: loadingMembers, 
    data: dataMembers, 
    error: errorMembers  } =  useQuery( queryMembers, 
                                        {
                                          context: { headers: getHeaders(location) },
                                          fetchPolicy: 'cache-first', 
                                          nextFetchPolicy: 'network-only', 
                                          notifyOnNetworkStatusChange: false,
                                        });

  useEffect(() => {
    if(!loadingMembers){
      if(!_.isEmpty(dataMembers?.members)){
        setUsers([])
        if(dataMembers.members.status){
          console.log("dataMembers.members.data :", dataMembers.members.data)
          _.map(dataMembers.members.data, (e, key)=>{
            setUsers((prevItems) => Array.isArray(prevItems) ? [...prevItems, e] : [e]);
          })
        }
      }
    }
  }, [dataMembers, loadingMembers])

  const handleYearChange = (yearType: 'start' | 'end', value: number) => {
    if (yearType === 'start') setStartYear(value);
    else setEndYear(value);

    const updatedRanges = getMonthsInRange(
      yearType === 'start' ? value : startYear,
      yearType === 'end' ? value : endYear
    );
    setMonthRanges(updatedRanges);
  };

  const handleSubmit = () => {
    if (!selectedMonth) {
      message.warning('Please select a month.');
      return;
    }

    const selectedRange = monthRanges.find((range) => range.month === selectedMonth);
    if (selectedRange) {
      const { startDate, endDate } = selectedRange;
      
      // Display or use the start and end dates as needed
      console.log(`Selected start date: ${startDate}`);
      console.log(`Selected end date: ${endDate}`);

      onCalcutePlanBack({ variables: { input: { startDate, endDate,  userId: selectedUser } } });
    
    }
    // message.success(`Selected month: ${selectedMonth}, Year range: ${startYear}-${endYear}, User: ${selectedUser}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Select 
        placeholder="Select month" 
        style={{ width: 200 }} 
        onChange={(value) => setSelectedMonth(value)}
      >
        {monthRanges.map((range) => (
          <Option key={range.month} value={range.month}>
            {range.month}
          </Option>
        ))}
      </Select>

      { 
      users && 
      <Select 
        placeholder="Select User" 
        style={{ width: 200 }} 
        onChange={(value) => setSelectedUser(value)}
      >
        {users.map((user) => (
          <Option key={user._id} value={user._id}>
            {user?.current?.displayName}
          </Option>
        ))}
      </Select>
      }
      
      <Button 
        type="primary" 
        style={{ width: 200 }} 
        disabled={!selectedMonth || !selectedUser} 
        onClick={handleSubmit}>
        คำนวณรายได้
      </Button>
    </div>
  );
};

export default CalcutePlanBackPage;