import React, { useState, useEffect } from 'react';
import { Form, Input, Checkbox, Button, InputNumber } from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, useLocation } from 'react-router-dom';
import _ from "lodash";

import { getHeaders } from "@/utils";
import { guery_product, mutation_product } from "@/apollo/gqlQuery";
import handlerError from "@/utils/handlerError";

import AttackFileField from "@/components/basic/attack-file"

const { TextArea } = Input;
const { Item } = Form;

interface FormValues {
  name: string;
  detail: string;
  plan: number[];
  price: number;
  packages: number[];
  images: RcFile[];
  quantity: number; // Add quantity field to the form values interface
}

const ProductForm: React.FC = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, _id } = location.state || {}; // Retrieve the state

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);  // Added loading state

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
            detail: product.current.detail,
            plan: product.current.plan,
            price: product.current.price,
            packages: product.current.packages,
            images: product.current.images,
            quantity: product.current.quantity, // Set quantity when in edit mode
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
    if (mode === 'added') {
      setLoading(true);
      onProduct({ variables: { input: { ...input, mode, images } } });
    } else {
      setLoading(true);
      onProduct({ variables: { input: { ...input, _id, mode, images } } });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        name: '',
        detail: '',
        plan: [],
        price: 0,
        packages: [],
        images: [],
        quantity: 0, // Set initial value for quantity
      }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter the product name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Detail"
        name="detail"
        rules={[{ required: true, message: 'Please enter the product detail!' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: 'Please enter the quantity!' }]}
      >
        <InputNumber min={0} />
      </Form.Item>

      <Item
        label="Attack File"
        name="images">
        <AttackFileField
          label={""}
          values={images}
          multiple={true}
          required={true}
          onSnackbar={(evt)=>console.log("onSnackbar :", evt)}
          onChange={(values) => setImages(values)}/>
      </Item>

      <Form.Item
        label="Plan"
        name="plan"
        rules={[{ required: true, message: 'Please enter the plan!' }]}
      >
        <Checkbox.Group>
          <Checkbox value={1}>Frontend</Checkbox>
          <Checkbox value={2}>Backend</Checkbox>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
      >
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        label="Package"
        name="packages"
        rules={[{ required: true, message: 'Please select at least one package!' }]}
      >
        <Checkbox.Group>
          <Checkbox value={1}>1</Checkbox>
          <Checkbox value={2}>8</Checkbox>
          <Checkbox value={3}>57</Checkbox>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;