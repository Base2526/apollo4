import React, { useState, useEffect } from 'react';
import { Card, Button, Descriptions, Spin, Tag, Modal } from 'antd';
import moment from "moment";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";
import { useSelector } from 'react-redux';
import { query_bills } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";

interface DataType {
    _id: string;
    current: any;
    updatedAt: any;
}

const BillList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [filteredData, setFilteredData] = useState<DataType[]>([]);
    const { profile } = useSelector((state: any) => state.user);

    const { loading: loadingBills, 
            data: dataBills, 
            error: errorBills,
            refetch: refetchBills } = useQuery(query_bills, {
                context: { headers: getHeaders(location) },
                fetchPolicy: 'cache-first', 
                nextFetchPolicy: 'network-only', 
                notifyOnNetworkStatusChange: false,
            });

    useEffect(() => {
        if (!loadingBills && dataBills?.bills?.status) {
            setFilteredData(dataBills.bills.data);
        }
    }, [dataBills, loadingBills]);

    return (
        <Spin spinning={loadingBills}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {filteredData.map((item) => (
                    <Card key={item._id} style={{ width: 300 }}>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="ID">{item._id}</Descriptions.Item>
                            <Descriptions.Item label="Date">
                                {moment(new Date(item.updatedAt)).format('MMMM Do YYYY, h:mm:ss a')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={item.current.status === 1 ? 'green' : 'red'}>
                                    {item.current.status === 0 ? "Unpaid" : "Paid"}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item>
                                <Button
                                    type="primary"
                                    disabled={item.current.status === 1}
                                    onClick={() =>{
                                        navigate("/administrator/billlist/bill", { state: { _id: item._id } })
                                    }}>
                                    View Bill Details
                                </Button>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                ))}
            </div>
        </Spin>
    );
};

export default BillList;
