import React, { useState, useEffect } from 'react';
import { Form, Input, Checkbox, Button, InputNumber, Row, Col, } from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, useLocation } from 'react-router-dom';
import _ from "lodash";

import { getHeaders } from "@/utils";
import { guery_product, mutation_product } from "@/apollo/gqlQuery";
import handlerError from "@/utils/handlerError";
import AttackFileField from "@/components/basic/attack-file"

const { TextArea } = Input;

interface FormValues {
  name: string;
  price: number;
  price_sell: number;
  detail: string;
  images: RcFile[],
  quantity: number;
  price_front: number;
  package_front: number[],
  package_back: number[],
  product_type: number[],
  price_discount_bm: number;
  price_discount_bs: number;
  price_discount_from_children: number;
  price_discount_from_office: number;
  all_sale: number;

  price_delivery: number;
}

const defaultValues = {
  name: '',
  price: 0,
  price_sell: 0,
  detail: '',
  images: [],
  quantity: 0,
  price_front: 0,
  package_front: [],
  package_back: [],
  product_type: [],
  price_discount_bm: 0,
  price_discount_bs: 0,
  price_discount_from_children: 0,
  price_discount_from_office: 0,
  all_sale: 0,

  price_delivery: 0,
};

const ProductForm: React.FC = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, _id } = location.state || {}; // Retrieve the state

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);  // Added loading state

  const [isPackageFrontChecked, setIsPackageFrontChecked] = useState(false);
  const [isPackageBackChecked, setIsPackageBackChecked] = useState(false);

  // Handle change for the "แผนหน้า" checkbox
  const handlePackageFrontChange = (e: any) => {
    setIsPackageFrontChecked(e.target.checked);
  };

  // Handle change for the "แผนหลัง" checkbox
  const handlePackageBackChange = (e: any) => {
    setIsPackageBackChecked(e.target.checked);
  };

  const [onProduct] = useMutation(mutation_product, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { product } }) => {
      console.log("product:", product);
    },
    onCompleted: (data) => {
      setLoading(false);  // Set loading to false when mutation completes
      navigate(-1);
    },
    onError: (error) => {
      setLoading(false);  // Set loading to false when an error occurs
      console.log("product onError:", error);
      handlerError(props, error);
    }
  });

  const { loading: loadingProduct, 
    data: dataProduct, 
    error: errorProduct,
    refetch: refetchProduct } = useQuery(guery_product, {
        context: { headers: getHeaders(location) },
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: false,
        skip: _.isEmpty(_id)
    });

  if (errorProduct) {
    handlerError(props, errorProduct);
  }

  useEffect(() => {
    if (mode === 'edited') {
      if (!loadingProduct && dataProduct?.product) {
        if (dataProduct.product.status) {
          let product = dataProduct.product.data;

          console.log("ProductForm :", product)
          form.setFieldsValue({
            name: product.current.name,
            price: product.current.price,
            price_sell: product.current.price_sell,
            detail: product.current.detail,
            images: product.current.images,
            quantity: product.current.quantity,
            price_front: product.current.price_front,
            package_front: product.current.package_front,
            package_back: product.current.package_back,
            product_type: product.current.product_type,
            price_discount_bm: product.current.price_discount_bm,
            price_discount_bs: product.current.price_discount_bs,
            price_discount_from_children: product.current.price_discount_from_children,
            price_discount_from_office: product.current.price_discount_from_office,
            all_sale: product.current.all_sale,

            price_delivery: product.current.all_sale,
          });

          setImages(product.current.images);
        }
      }
    }
  }, [dataProduct, loadingProduct]);

  useEffect(() => {
    if (mode === 'edited') {
      refetchProduct({ id: _id });
    }
  }, [mode, refetchProduct]);

  const onFinish = (input: FormValues) => {

    console.log("onFinish :", input)

    if (mode === 'added') {
      setLoading(true);
      onProduct({ variables: { input: { ...input, mode, images } } });
    } else {
      setLoading(true);
      onProduct({ variables: { input: { ...input, _id, mode, images } } });
    }
  };

/*
{label="ชื่อสินค้า" name="name"}
{label="ราคา (บาท)" name="price"}
{label="ราคาขาย (บาท)" name="price_sell"}
{label="รายละเอียด" name="detail"}
{label="ไฟล์แนบ" name="images"}
{label="จำนวนสินค้าทั้งหมด" name="quantity"}
{label="ส่วนลดหน้าร้าน %" name="price_front"}
{label="ประเภทสินค้า" name="product_type"}
{name="package_front"}
{name="package_back"}
{label="ส่วนลดเฉพาะตำแหน่ง BM (ไม่เกิม 5%)" name="price_discount_bm"}
{label="ส่วนลดมาตรฐาน BS (%)" name="price_discount_bs"}
{label="ส่วนลดค่าแนะนำจาการซื้อ/ขายชของลูกทีม ติดตัวเท่านั้น" name="price_discount_from_children"}
{label="ส่วนลดค่าสำนักงาน (%)" name="price_discount_from_office"}
{label="All Sale (%)" name="all_sale"}
*/

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={defaultValues}>
      <Form.Item
        label="ชื่อสินค้า"
        name="name"
        rules={[{ required: true, message: '' }]}
        help="หมายเหตุ: ชื่อสินค้า"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="ราคา (บาท)"
        name="price"
        rules={[{ required: true, message: '' }]}
        help="หมายเหตุ: ราคา (บาท)"
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="ราคาขาย (บาท)"
        name="price_sell"
        rules={[{ required: true, message: '' }]}
        help="หมายเหตุ: ราคาขาย (บาท)">
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="รายละเอียด"
        name="detail"
        rules={[{ required: true, message: '' }]}
        help="หมายเหตุ: รายละเอียด">
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item
        label="ไฟล์แนบ"
        name="images"
        rules={[{ required: true, message: '' }]}
        help="หมายเหตุ: สามารถใส่รูปได้ไม่เกิม  10 รูป">
        <AttackFileField
          label={""}
          values={images}
          multiple={true}
          required={true}
          onSnackbar={(evt)=>console.log("onSnackbar :", evt)}
          onChange={(values) => setImages(values)}/>
      </Form.Item>
      <Form.Item
        label="จำนวนสินค้าทั้งหมด"
        name="quantity"
        rules={[{ required: true, message: '' }]}
        help="หมายเหตุ: จำนวนสินค้าทั้งหมด">
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="ส่วนลดหน้าร้าน %"
        name="price_front"
        rules={[{ required: true, message: '' }]}
        help="หมายเหตุ: ส่วนลดหน้าร้าน">
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="ประเภทสินค้า"
        name="product_type"
        style={{display: 'flow-root'}}
        rules={[
          {
            required: true,
            message: 'กรุณาเลือกอย่างน้อยหนึ่งตัวเลือก!',
          },
        ]}>
        <Checkbox.Group>
          {/* Row for 'เอกสิทธิพิเศษ' */}
          <Row>
            <Col>
              <Checkbox value={1}>เอกสิทธิพิเศษ</Checkbox>
            </Col>
          </Row>

          {/* Row for 'แผนหน้า' */}
          <Row>
            <Col>
              <Checkbox  value={2} onChange={handlePackageFrontChange}>แผนหน้า</Checkbox>
            </Col>
            <Col>
              <Form.Item
                name="package_front"
                rules={[
                  {
                    required: isPackageFrontChecked,
                    message: 'กรุณาเลือกตัวเลือกสำหรับแผนหน้า!',
                  },
                ]}>
                <Checkbox.Group disabled={!isPackageFrontChecked}>
                  <Checkbox value={1}>1</Checkbox>
                  <Checkbox value={2}>8</Checkbox>
                  <Checkbox value={3}>56</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* Row for 'แผนหลัง' */}
          <Row>
            <Col>
              <Checkbox  value={3} onChange={handlePackageBackChange}>แผนหลัง</Checkbox>
            </Col>
            <Col>
              <Form.Item
                name="package_back"
                rules={[
                  {
                    required: isPackageBackChecked,
                    message: 'กรุณาเลือกตัวเลือกสำหรับแผนหลัง!',
                  },
                ]}>
                <Checkbox.Group disabled={!isPackageBackChecked}>
                  <Checkbox value={1}>1</Checkbox>
                  <Checkbox value={2}>8</Checkbox>
                  <Checkbox value={3}>56</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* Row for 'Power ship' */}
          <Row>
            <Col>
              <Checkbox value={4}>Power ship</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item
        label="ส่วนลดเฉพาะตำแหน่ง BM (ไม่เกิม 5%)"
        name="price_discount_bm"
        rules={[{ required: true, message: '' }]}
        help="หมายเหตุ: ส่วนลดเฉพาะตำแหน่ง BM ">
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="ส่วนลดมาตรฐาน BS (%)"
        name="price_discount_bs"
        rules={[{ required: true, message: '' }]}
        help="หมายเหตุ: ส่วนลดมาตรฐาน BS">
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="ส่วนลดค่าแนะนำจาการซื้อ/ขายชของลูกทีม ติดตัวเท่านั้น"
        name="price_discount_from_children"
        rules={[{ required: true, message: '' }]}
        help="หมายเหตุ: ส่วนลดค่าแนะนำจาการซื้อ/ขายชของลูกทีม ติดตัวเท่านั้น">
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        label="ส่วนลดค่าสำนักงาน (%)"
        name="price_discount_from_office"
        rules={[{ required: true, message: '' }]}
        help="หมายเหตุ: ส่วนลดค่าสำนักงาน">
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        label="All Sale (%)"
        name="all_sale"
        rules={[{ required: true, message: '' }]}
        help="หมายเหตุ: All Sale">
        <InputNumber min={0} />
      </Form.Item>
      // 
      <Form.Item
        label="ค่าจัดส่ง"
        name="price_delivery"
        rules={[{ required: true, message: '' }]}
        help="หมายเหตุ: ค่าจัดส่ง">
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          สร้าง
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;