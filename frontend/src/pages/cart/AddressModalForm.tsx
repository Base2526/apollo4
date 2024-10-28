import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import { mutation_address_delivery } from '@/apollo/gqlQuery';
import { getHeaders } from '@/utils';
import handlerError from '@/utils/handlerError';
import { updateAddressDelivery } from '@/stores/user.store';

import { DefaultRootState } from "@/interface/DefaultRootState"

interface FormValues {
  name: string;
  phone: string;
  address: string;
}

interface AddressModalFormProps {
  isModalVisible: boolean;
  setIsModalVisible: () => any;
}

// Define a regex pattern for phone numbers (adjust as needed)
const phoneNumberRegex = /^[0-9]{10}$/;


const defaultValues = {
  name: '',
  phone: '',
  address: '',
}

const AddressModalForm: React.FC<AddressModalFormProps> = (props) => {
  const { isModalVisible, setIsModalVisible } = props;

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Loading state for OK button

  const { profile } = useSelector((state: DefaultRootState) => state.user);

  const dispatch = useDispatch();

  const [onAddressDelivery] = useMutation(mutation_address_delivery, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { address_delivery } }, params: any) => {
      let { status } = address_delivery
      if(status){
        let { input } = params?.variables;
        dispatch(updateAddressDelivery({ addressDelivery: input }));

        setLoading(false); // Reset loading state after success
        message.success('แก้ไขที่อยู่ เรียบร้อย!');
        setIsModalVisible();

        navigate("/checkout")
      }
      
    },
    onError: (error) => {
      setLoading(false); // Reset loading state on error
      handlerError(props, error);
      setIsModalVisible();
    },
  });

  useEffect(()=>{
    if(profile.current?.address_delivery){
      let { address_delivery } = profile.current
      form.setFieldsValue({
        name: address_delivery.name,
        phone: address_delivery.phone,
        address: address_delivery.address,
      })
    }
  }, [profile])

  const handleCancel = () => {
    setIsModalVisible();
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values: FormValues) => {
        setLoading(true); // Set loading state on form submit
        // Trigger mutation

        let input = {...values, mode: "added"}

        onAddressDelivery({ variables: { input } });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="ที่อยู่ใหม่"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="ยืนยัน"
      cancelText="ยกเลิก"
      confirmLoading={loading} // Loading state for OK button
    >
      <Form 
        form={form} 
        initialValues={defaultValues}
        layout="vertical">
        <Form.Item
          name="name"
          label="ชื่อ-นามสกุล"
          rules={[{ required: true, message: 'กรุณากรอกชื่อ-นามสกุล' }]}
        >
          <Input placeholder="ชื่อ-นามสกุล" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="หมายเลขโทรศัพท์"
          rules={[
            { required: true, message: 'กรุณากรอกหมายเลขโทรศัพท์' },
            { pattern: phoneNumberRegex, message: 'หมายเลขโทรศัพท์ไม่ถูกต้อง' },
          ]}
        >
          <Input placeholder="หมายเลขโทรศัพท์" />
        </Form.Item>

        <Form.Item
          name="address"
          label="บ้านเลขที่,ซอย,หมู่,ถนน,แขวง/ตำบล,เขต/อำเภอ,จังหวัด,รหัสไปรษณีย์"
          rules={[{ required: true, message: 'กรุณากรอกรายละเอียดที่อยู่' }]}
        >
          <Input.TextArea
            placeholder="บ้านเลขที่,ซอย,หมู่,ถนน,แขวง/ตำบล,เขต/อำเภอ,จังหวัด,รหัสไปรษณีย์"
            autoSize={{ minRows: 3, maxRows: 5 }} // Adjust the number of rows
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddressModalForm;
