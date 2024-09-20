import React, { useState, useEffect } from 'react';
import { Form, Input, Tag, Button, Typography, Tree, Row, Col, Skeleton, message, Image } from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { getHeaders } from '@/utils';
import { guery_order, mutation_order } from '@/apollo/gqlQuery';
import handlerError from '@/utils/handlerError';
import AttackFileField from '@/components/basic/attack-file';
import { DefaultRootState } from '@/interface/DefaultRootState';
import * as Constants from "@/constants";
import * as utils from "@/utils";
import { OrderItem, OrderProductDetail }  from "@/interface/user/user"

const { TextArea } = Input;
const { Paragraph, Text } = Typography;


interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

const images: ImageItem[] = [
  { id: 1, src: 'https://via.placeholder.com/150', alt: 'Image 1' },
  { id: 2, src: 'https://via.placeholder.com/150', alt: 'Image 2' },
  { id: 3, src: 'https://via.placeholder.com/150', alt: 'Image 3' },
  { id: 4, src: 'https://via.placeholder.com/150', alt: 'Image 4' },
  { id: 5, src: 'https://via.placeholder.com/150', alt: 'Image 5' },
  { id: 6, src: 'https://via.placeholder.com/150', alt: 'Image 6' },
  { id: 7, src: 'https://via.placeholder.com/150', alt: 'Image 7' },
  { id: 8, src: 'https://via.placeholder.com/150', alt: 'Image 8' },
  { id: 9, src: 'https://via.placeholder.com/150', alt: 'Image 9' },
  { id: 10, src: 'https://via.placeholder.com/150', alt: 'Image 10' },
];

interface FormValues {
  name: string;
  detail: string;
  plan: number[];
  price: number;
  packages: number[];
  images: RcFile[];
}

const mode = 'edited';
const OrderForm: React.FC = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { _id } = location.state || {};

  const { profile } = useSelector((state: DefaultRootState) => state.user);

  const [form] = Form.useForm();
  const [order, setOrder] = useState<OrderItem>();
  const [attachFile, setAttachFile] = useState<File[]>([]);
  const [productDetails, setProductDetails] = useState<OrderProductDetail[]>([]);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const [onOrder] = useMutation(mutation_order, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { order } }) => {
      console.log("useMutation order :", order)
    },
    onCompleted: (data, clientOptions) => {
      let { variables: { input } } : any = clientOptions;

      if(input?.type === 2){
        message.success('Update order successfully!');
        setLoadingComplete(false)

        navigate(-1);
      }
      if(input?.type === 3){
        message.success('Cancel order successfully!');
        setLoadingCancel(false)

        navigate(-1);
      }
    },
    onError: (error) => {
      setLoadingComplete(false)
      setLoadingCancel(false)

      handlerError(props, error);
    }
  });

  const { loading: loadingOrder, data: dataOrder, error: errorOrder, refetch: refetchOrder } = useQuery(guery_order, {
    context: { headers: getHeaders(location) },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (errorOrder) {
      handlerError(props, errorOrder);
    }
  }, [errorOrder]);

  useEffect(() => {
    if (mode === 'edited' && !loadingOrder && dataOrder?.order) {
      const order = dataOrder.order.data;

      console.log("order : ", order)
      form.setFieldsValue({
        _id: order._id,
        ownerName: order.owner.current.displayName,
        status: order.current.status,
        editer: order.editer !== undefined ? order.editer.current.displayName : "",
        total: _.sumBy(order.productDetails, (item: OrderProductDetail) => item.current.price ),
        message: order.current.message,
      });

      setOrder(order)
      setAttachFile(order.current.attachFile);
      setProductDetails(order.productDetails);
    }
  }, [dataOrder, loadingOrder, form]);

  useEffect(() => {
    if (mode === 'edited') {
      refetchOrder({ id: _id });
    }
  }, [_id, mode, refetchOrder]);

  const onFinish = (input: FormValues) => {
    setLoadingComplete(true);

    let newInput = {...input, mode: 'edited', type: 2}
    console.log("handleCancel input :", newInput)

    onOrder({ variables: { input: newInput } });
  };

  const handleCancel = () => {
    form.validateFields().then(() => {
      setLoadingCancel(true);
      let  input = form.getFieldsValue(); 
      input = {...input, mode: 'edited', type: 3}

      console.log("handleCancel input :", input)

      onOrder({ variables: { input } });
    }).catch((errorInfo) => {
      console.log('Form validation failed:', errorInfo);
    });
  };

  const statusView = (status: number) => {
    switch (status) {
      case 1:
        return 'WAITING';
      case 2:
        return 'COMPLETE';
      case 3:
        return 'CANCEL';
      case 4:
        return 'DELETE';
      default:
        return 'UNKNOWN';
    }
  };

  const messageView = () => {
    const status = form.getFieldValue('status');
    const message = form.getFieldValue('message');
    switch (status) {
      case 1:
        return <TextArea rows={4} />;
      case 2:
      case 3:
      case 4:
        if(message)return <Paragraph copyable>{message}</Paragraph> ;
      default:
        return null;
    }
  };

  return (
    <Skeleton loading={loadingOrder} active>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          _id: '',
          ownerName: '',
          productIds: [],
          status: 0,
          total: 0,
          editer: '',
          message: '',
          attachFile: [],
        }}
        style={{paddingBottom: 20}}
      >
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item name="_id" label="Code ID">
              {/* <Tag color="#2db7f5">{form.getFieldValue('_id')}</Tag> */}
              <Paragraph copyable>{form.getFieldValue('_id')}</Paragraph>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item name="productIds" label="Product IDs">
              <Tree
                treeData={productDetails.map((detail, index) => {

                  if(order !== undefined){
                    let productId = _.find(order.current.productIds, (item) =>item.productId === detail._id)
                    let quantities = productId !== undefined ? productId.quantities : 0

                    return{
                      title: `${index+1} : ${detail.current.name} - $${detail.current.price} x ${ quantities }`,
                      key: detail._id,
                      // You can add more properties here if needed
                    }
                  }
                  
                  return {
                    title: `${index + 1}. ${detail.current.name} - $${detail.current.price}`,
                    key: detail._id,
                  }
                }
                )}
                defaultExpandAll
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Form.Item name="status" label="Status">
                <Tag color="#2db7f5">{statusView(form.getFieldValue('status'))}</Tag>
              </Form.Item>
              <Form.Item name="total" label="Total">
                <Tag color="#2db7f5">{form.getFieldValue('total')}</Tag>
              </Form.Item>
              {
                utils.checkRole(profile) === Constants.ADMINISTRATOR &&
                <>
                  <Form.Item name="editer" label="Approver">
                    <Tag color="#2db7f5">{form.getFieldValue('editer')}</Tag>
                  </Form.Item>
                  <Form.Item name="ownerName" label="Owner">
                    <Tag color="#2db7f5">{form.getFieldValue('ownerName')}</Tag>
                  </Form.Item>
                </>
              }
            </div>
          </Col>
        </Row>
        {
          utils.checkRole(profile) === Constants.ADMINISTRATOR &&
          <>
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item name="message" label="Message" rules={[{ required: true, message: 'Please input the message' }]}>
                  {messageView()}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                {
                  order?.current.status !== 1
                  ? order?.current.attachFile !== undefined
                    ?  <div >
                        <>Attach Files</>
                        <Row gutter={[16, 16]}>
                          {order.current.attachFile.map((image) => (
                            <Col key={image.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                              <Image
                                src={`http://localhost:1984/${image.url}`}
                                alt={"image.alt"}
                                width={100}
                                // style={{ width: '100%', height: 'auto' }}
                              />
                            </Col>
                          ))}
                        </Row>
                      </div>
                    : <></>
                  : <Form.Item name="attachFile" label="Attach Files">
                      <AttackFileField
                        label=""
                        values={attachFile}
                        multiple
                        required
                        onSnackbar={(evt)=>{ console.log("evt :", evt)}}
                        onChange={(values) => setAttachFile(values)}
                      />
                    </Form.Item>
                }
              </Col>
            </Row>
            {form.getFieldValue('status') === 1 && (
              <Form.Item>
                <Button type="default" onClick={handleCancel} style={{ marginRight: '8px' }} loading={loadingCancel}>
                  Cancel Order
                </Button>
                <Button type="primary" htmlType="submit" loading={loadingComplete}>
                  Complete Order
                </Button>
              </Form.Item>
            )}
          </>
        }
      </Form>
    </Skeleton>
  );
};

export default OrderForm;