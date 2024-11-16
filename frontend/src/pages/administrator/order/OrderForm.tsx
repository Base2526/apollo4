import React, { useState, useEffect } from 'react';
import { Form, Input, Tag, Button, Typography, Tree, Row, Spin, message, Descriptions, Col, Image, Radio } from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { guery_order, query_positions, mutation_order } from '@/apollo/gqlQuery';
import handlerError from '@/utils/handlerError';
import AttackFileField from '@/components/basic/attack-file';
import { DefaultRootState } from '@/interface/DefaultRootState';
import * as Constants from "@/constants";
import * as utils from "@/utils";
import { OrderItem, OrderProductDetail, PositionInterface }  from "@/interface/user/user"

import { getHeaders, ___price_discount_bm_or_bs, ___vat, ___discount_position_for_member } from '@/utils';
import { useAppContext } from '@/AppContext';

const { TextArea } = Input;
const { Paragraph, Text } = Typography;

interface FormValues {
  name: string;
  detail: string;
  plan: number[];
  price: number;
  packages: number[];
  images: RcFile[];
  status: number;
}

const defaultValues = {
  message: '',
  status:0
}

const OrderForm: React.FC = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, _id } = location.state || {};

  // console.log("OrderForm :", _id, mode)
  const { profile } = useSelector((state: DefaultRootState) => state.user);

  const { homeFilter } = useAppContext();

  const [form] = Form.useForm();
  const [order, setOrder] = useState<OrderItem>();
  const [images, setImages] = useState<File[]>([]);
  const [productDetails, setProductDetails] = useState<OrderProductDetail[]>([]);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const [data, setData] = useState<any>();

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

  const [positions, setPositions] = useState<PositionInterface[]>([]);

  const { loading: loadingPositions, data: dataPositions } = useQuery(query_positions, {
    context: { headers: getHeaders(location) },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (!loadingPositions && !_.isEmpty(dataPositions?.positions)) {
        const { status, data } = dataPositions.positions;
        if (status) {
            setPositions(data);
        }
    }
  }, [dataPositions, loadingPositions]);

  const { loading: loadingOrder, 
          data: dataOrder, 
          error: errorOrder, 
          refetch: refetchOrder } = useQuery(guery_order, {
                                                            context: { headers: getHeaders(location) },
                                                            fetchPolicy: 'no-cache',
                                                            nextFetchPolicy: 'network-only',
                                                            notifyOnNetworkStatusChange: false,
                                                            skip: _.isEmpty(_id)
                                                          });

  if (errorOrder) {
    handlerError(props, errorOrder);
  }

  useEffect(() => {
    // if (mode === 'edited') {
    // console.log("@@@@1234 :", dataOrder)
      if(!loadingOrder && dataOrder?.order){
        if (dataOrder.order.status) {
          const order = dataOrder.order.data;
          console.log("@@@@order : ", order )

          setData(order)

          order.current.status !== 1 && 
          form.setFieldsValue({
            // _id: order._id,
            // // ownerName: order.owner.current.displayName,
            // status: order.current.status,
            // editer: order.editer !== undefined ? order.editer.current.displayName : "",
            // total: _.sumBy(order.productDetails, (item: OrderProductDetail) => item.current.price ),
            message: order.current.message,
            status: order.current.status
          });

          // setOrder(order)
          // setAttachFile(order.current.attachFile);
          // setProductDetails(order.productDetails);
        }
      }
    // }
  }, [dataOrder, loadingOrder, form]);

  useEffect(() => {
    // if (mode === 'edited') {
    refetchOrder({ id: _id });
    // }
  }, [_id, refetchOrder]);

  const onFinish = (input: FormValues) => {
    // console.log("onFinish : ", input)
    setLoadingComplete(true);
    let newInput = {...input, _id, mode: 'edited', type: input.status}
    console.log("onFinish input :", newInput)
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

  const ___position = () =>{
    let { owner, products} = data.current
    let position = _.find(positions, (p)=>p._id?.toString() === owner?.positionId?.toString())

    return position?.name;
  }

  const ___detail = () =>{
    let { owner, products} = data.current
    return  <Tree
              treeData={products.map((detail: any, index: number) => {
                let { quantities, product} = detail
                return{
                  title: `${index+1} : ${product.name}(${ ___vat(product.vat) }) - ฿${product.price_sell} x ${ quantities }, ส่วนลดตำแหน่ง (${ ___price_discount_bm_or_bs(positions, profile.current.positionIds, product) }%), ค่าจัดส่ง (${ product.price_delivery })`,
                  key: detail._id
                }
              })}
              defaultExpandAll
            />
  }

  const ___detail2 = () =>{
    let { products } = data.current

    const summaryDelivery = (products: any[]) =>{
      return _.sumBy(products, (item) => item.product.price_delivery )
    }

    const summaryPriceDiscount = (products: any[]) =>{
      let sum_price = 0;
      _.map(products, (cart, index)=>{
        let { quantities, product } = cart

        let newProduct = {...product, quantities}
        // console.log("summaryPriceDiscount :", index, newProduct, cart)
        switch(product.vat){
          // None
          case 0:{
            let discount_position_for_member = ___discount_position_for_member(positions, profile.current.positionIds, newProduct);
            let price = (parseInt(product.price_sell)  * quantities) - discount_position_for_member;
            sum_price += price;              
            break;
          }

          // Include
          case 1:{
            let discount_position_for_member = ___discount_position_for_member(positions, profile.current.positionIds, newProduct);
            let price  =  (parseInt(product.price_sell)  * quantities) - discount_position_for_member;
            sum_price += price;
            break;
          }

          // Exclude
          case 2:{
            let discount_position_for_member = ___discount_position_for_member(positions, profile.current.positionIds, newProduct);
            let price  =  ((parseInt(product.price_sell)  * quantities) + (parseInt(product.price_sell)  * quantities) * (homeFilter.tax/100)) - discount_position_for_member;
            sum_price += price;
            break;
          }
        }
      })

      return sum_price;
    }

    const ___tax_at_pay5 = (products: any[]) =>{
      let ___summary_discount = 0;
      
      _.map(products, (cart, index)=>{
        let { quantities, product } = cart
        let newProduct = {...product, quantities}

        let price  = ___discount_position_for_member(positions, profile.current.positionIds, newProduct)
        ___summary_discount += price
      })

      return ___summary_discount * 5/100;
    }

    return  <> 
              <Descriptions.Item label="ค่าจัดส่ง">{ summaryDelivery(products) }</Descriptions.Item>
              <Descriptions.Item label="ภาษีหัก ณ​ ที่จ่าย 5%">{ ___tax_at_pay5(products) }</Descriptions.Item>
              <Descriptions.Item label="ราคาหักส่วนลด">{ summaryPriceDiscount(products) }</Descriptions.Item>
              <Descriptions.Item label="ยอดชำระเงินทั้งหมด">฿{ Math.ceil(summaryPriceDiscount(products) + ___tax_at_pay5(products) + summaryDelivery(products)) }</Descriptions.Item>
            </>
  }

  return( <div style={{ padding: '20px' }}>
            {
              _.isEmpty(data)
              ? <Spin />
              : <>
                  <Descriptions
                    title="รายละเอียด"
                    bordered
                    column={1} // Display one field per row
                    style={{paddingTop: 10}}
                  >
                    <Descriptions.Item label="Code Id">{ data._id }</Descriptions.Item>
                    <Descriptions.Item label="ตำแหน่ง">{ ___position() }</Descriptions.Item>
                    <Descriptions.Item label="รายละเอียด">{ ___detail() }</Descriptions.Item>
                    { ___detail2() }
                  </Descriptions>
                  
                  {
                    utils.checkRole(profile) === Constants.ADMINISTRATOR 
                    &&  <>
                          <div style={{paddingTop: 20, fontSize: 18, fontWeight: 'bold'}}>ส่วนของ คนดูแลระบบ</div>
                          <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={defaultValues}>
                            <>
                              <Row gutter={16}>
                                <Col span={16}>
                                  <Form.Item 
                                    name="message" 
                                    label="ข้อความ" 
                                    rules={[{ required: true, message: 'Please input the message' }]}>
                                    <TextArea rows={4} />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={16}>
                                <Col span={16}>
                                    <Form.Item name="images" label="ไฟล์แนบ">
                                      <AttackFileField
                                        label=""
                                        values={images}
                                        multiple
                                        required
                                        onSnackbar={(evt)=>{ console.log("evt :", evt)}}
                                        onChange={(values) => setImages(values)}
                                      />
                                    </Form.Item>
                                </Col>
                              </Row>
                              <Form.Item
                                label="สถานะ"
                                name="status"
                                rules={[{ required: true, message: 'Please select a status' }]}
                                help="หมายเหตุ: สถานะ"
                              >
                                <Radio.Group>
                                  <Radio value={2}>สำเร็จ</Radio>
                                  <Radio value={3}>ยกเลิก</Radio>
                                </Radio.Group>
                              </Form.Item>
                              <Form.Item>
                                <Button type="primary" htmlType="submit">แก้ไข</Button>
                              </Form.Item>
                            </>
                          </Form>
                        </>
                  }
                </> 
            }
          </div>)

  /*
  return2 (<Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={defaultValues}
            style={{paddingBottom: 20}}
          >
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item name="_id" label="Code ID">
                  <Input disabled={true}/>
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
                    <Input disabled={true}/>
                  </Form.Item>
                  <Form.Item name="total" label="Total">
                    <Tag color="#2db7f5">{form.getFieldValue('total')}</Tag> 
                    <Input disabled={true}/>
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
          </Form>);
          */
};

export default OrderForm;