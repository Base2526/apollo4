// src/UserForm.tsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Upload, Button, Select, Tag, Modal, Row, Col, message, Image, GetProp, UploadProps, Card, List, Typography} from 'antd';
import moment from 'moment';
import { UploadOutlined, LoadingOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons';
import type { RcFile, UploadChangeParam } from 'antd/es/upload/interface';
import { useQuery, useMutation } from "@apollo/client";
import { useLocation } from 'react-router-dom';
import _ from "lodash"
import { query_bill, mutationProfile, mutation_paid_bill } from "../../apollo/gqlQuery"
import { getHeaders } from "../../utils"

const { Title } = Typography;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const { Option } = Select;

interface DataType {
  _id:string | undefined;
  current:{
    parentNodeId: string;
    isParent: Boolean;
    status: number;
    ownerId: string;
    number: number;
  }
}
interface CopyButtonProps {
  text: string | undefined;
}


const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const handleCopy = () => {
    if(text !== undefined){
      navigator.clipboard.writeText(text).then(() => {
        message.success('Copied to clipboard!');
      }).catch(() => {
        message.error('Failed to copy!');
      });
    }else{
      message.error('Failed to copy!');
    }
  };

  return (
    <Button
      icon={<CopyOutlined />}
      onClick={handleCopy}
      type="link"
      style={{ marginLeft: 8 }}
    />
  );
};

const Bill: React.FC = () => {
  const location = useLocation();
  const { _id } = location.state || {}; // Retrieve the state
  const [form] = Form.useForm();
  const [data, setData] = useState<DataType | undefined>();

  const [mode, setMode] = useState<'view' | 'edit'>('view'); // Set default mode to view
  const [avatar, setAvatar] = useState<File | null>(null); // State for uploaded avatar

  const [imageUrl, setImageUrl] = useState<string>("https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/698.jpg");
  const [loading, setLoading] = useState(false);

  const [onPaidBill, resultPaidBill] = useMutation(mutation_paid_bill, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { paid_bill } }) => {
        console.log("paid_bill ", paid_bill);

        refetchBill()
    },
    onError(error) {
        console.log("paid_bill onError :", error);
    }
  });

  const [onMutationProfile, resultProfile] = useMutation(mutationProfile, {
      context: { headers: getHeaders(location) },
      update: (cache, {data: {profile}}) => {
          console.log("update :", profile)
      },
      onCompleted(data) {
          console.log("onCompleted :", data)
      },
      onError(error){
          console.log("onError :", error)
      }
  });

  const { loading: loadingBill, 
          data: dataBill, 
          error: errorBill,
          refetch: refetchBill } = useQuery(query_bill, {
              context: { headers: getHeaders(location) },
              // variables: { id: node?._id },
              fetchPolicy: 'cache-first', 
              nextFetchPolicy: 'network-only', 
              notifyOnNetworkStatusChange: false,
          });

  useEffect(() => {
    if (!loadingBill && dataBill?.bill?.status) {
      setData(dataBill.bill.data);

      console.log("dataBill.bill.data :", dataBill.bill.data)

      
      form.setFieldsValue({ date:  (moment(new Date(dataBill.bill.data.createdAt), 'YYYY-MM-DD HH:mm')).format('MMMM Do YYYY, h:mm:ss a')})
    }
  }, [dataBill, loadingBill]);

  useEffect(()=>{
    refetchBill({ id: _id });
  }, [_id])

  // useEffect(()=>{
  //   form.setFieldsValue({ parentId: id });
  // }, [id])
  

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

//   const handleFileChange = (info: UploadChangeParam<RcFile>) => {
//     if (info.file.status === 'done') {
//       setUser({
//         ...user,
//         avatar: {
//           url: info.file.response.url, // Assume the server returns a URL
//           filename: info.file.name,
//           mimetype: info.file.type,
//           encoding: info.file.encoding,
//         },
//       });
//     }
//   };
  const handleFileChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
    //   setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        // setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const onFinish = (values: DataType) => {
    console.log('Form values:', values);
    if (data?._id) {
      handleMarkAsPaid(data._id);
    } else {
      console.error('Error: data or data._id is undefined');
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      // You can perform validation before upload
      console.log('Selected file:', file);
      return false; // Prevent auto upload
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  

  const renderStatusTag = (status: string) => {
    let color;
    switch (status) {
      case 'paid':
        color = 'green';
        break;
      case 'unpaid':
        color = 'red';
        break;
      case 'pending':
        color = 'orange';
        break;
      default:
        color = 'blue';
        break;
    }
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  const handleMarkAsPaid = (id: string) => {
    Modal.confirm({
        title: 'Are you sure you want to mark this as paid?',
        content: `ID: ${id}`,
        onOk() {
            onPaidBill({ variables: { input: { id } } });
        },
        onCancel() {
            console.log('Cancelled');
        },
    });
  };

  return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ 
              id: '12345', 
              status: 'unpaid', 
              date: moment(), // Ensure that the date is a moment object if using DatePicker
              comment: "Your initial comment here" // Add other initial values as needed
            }}>
            <h2>BILL</h2>
            <Form.Item
              label="ID"
              name="id"
              style={{ display: 'flex', alignItems: 'center' }}>
              <Tag color="blue">{data?._id}</Tag>
              <CopyButton text={data?._id} />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
            >
             {renderStatusTag(data?.current?.status === 0 ? "unpaid": "paid")}
            </Form.Item>

            <Form.Item
              label="Date"
              name="date"
            >
              <Input readOnly placeholder="Date" />
            </Form.Item>

            <Form.Item
              label="File Upload"
              name="upload"
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Comment"
              name="comment"
            >
              <Input.TextArea rows={4} placeholder="Add your comment here" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Transferred, Notify Admin
              </Button>
            </Form.Item>
          </Form>
        </div>
      );
};

export default Bill;