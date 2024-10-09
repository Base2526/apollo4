import "./index.less";

import React, { FC, useEffect, useState } from 'react';
import { Card, Layout, Form, Input, Button, message, Select, DatePicker, Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from "@apollo/client";
import { useLocation, useNavigate, useParams} from 'react-router-dom';
import { mutationRegister } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";
import handlerError from "@/utils/handlerError"

const userNameRegex = /^[a-zA-Z0-9]+$/;
const idCardRegex = /^\d{13}$/;
const phoneNumberRegex = /^[0-9]{10}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const initialValues = {
  parentId: '', // Hidden field value
  username: '',
  idCard: '',
  email: '',
  tel: '',
  // password: '',
  // confirmPassword: '',
  packages: 1,

  car_brand: '',
  car_model: '',
  car_date_register: null,
};

const carModelsData: Record<string, string[]> = {
  HONDA: ["Civic", "Accord", "CR-V", "Jazz", "Fit", "HR-V", "Odyssey"],
  TOYOTA: ["Corolla", "Camry", "Yaris", "Hilux", "Fortuner", "RAV4", "Prius"],
  MITSUBISHI: ["Pajero", "Outlander", "Triton", "Mirage", "Lancer"],
  ISUZU: ["D-Max", "MU-X"],
  MAZDA: ["CX-5", "CX-3", "Mazda3", "Mazda6"],
  NISSAN: ["Altima", "Sentra", "Rogue", "X-Trail", "Navara"],
  FORD: ["Mustang", "Focus", "Ranger", "Everest"],
  SUZUKI: ["Swift", "Ertiga", "Vitara"],
  MG: ["ZS", "HS", "MG3", "MG5"],
  BMW: ["3 Series", "5 Series", "X5", "X3"],
  AION: ["LX", "V Plus"],
  "ALFA ROMEO": ["Giulia", "Stelvio"],
  "ASTON MARTIN": ["DB11", "Vantage", "DBX"],
  AUDI: ["A4", "A6", "Q5", "Q7"],
  BENTLEY: ["Bentayga", "Continental GT", "Flying Spur"],
  BYD: ["Atto 3", "Tang", "Dolphin"],
  CHANGAN: ["CS35", "CS75"],
  CHERY: ["Tiggo 8", "Arrizo 5"],
  CHEVROLET: ["Cruze", "Camaro", "Colorado"],
  CHRYSLER: ["300", "Pacifica"],
  CITROEN: ["C3", "C5 Aircross"],
  DAEWOO: ["Lanos", "Nubira"],
  DAIHATSU: ["Terios", "Mira", "Move"],
  DEEPAL: ["SL03"],
  DFM: ["AX7", "S560"],
  DFSK: ["Glory 580"],
  FERRARI: ["488", "Roma", "SF90"],
  FIAT: ["500", "Panda", "Tipo"],
  FOMM: ["One"],
  FOTON: ["Tunland", "View"],
  "GWM TANK": ["300", "500"],
  HAVAL: ["H6", "Jolion"],
  HOLDEN: ["Commodore", "Captiva"],
  HUMMER: ["H1", "H2"],
  HYUNDAI: ["Elantra", "Tucson", "Santa Fe"],
  JAC: ["S4", "S7"],
  JAGUAR: ["XF", "F-Pace", "E-Pace"],
  JEEP: ["Grand Cherokee", "Wrangler", "Compass"],
  KIA: ["Sorento", "Sportage", "Rio"],
  LAMBORGHINI: ["Huracan", "Aventador", "Urus"],
  "LAND ROVER": ["Range Rover", "Discovery", "Defender"],
  LEXUS: ["RX", "NX", "ES"],
  LOTUS: ["Evora", "Elise"],
  MASERATI: ["Ghibli", "Levante", "Quattroporte"],
  MAXUS: ["D60", "G10"],
  MCLAREN: ["720S", "GT"],
  "MERCEDES-BENZ": ["C-Class", "E-Class", "S-Class", "GLE", "GLC"],
  MINE: ["SPA1"],
  MINI: ["Cooper", "Countryman"],
  MITSUOKA: ["Himiko", "Ryugi"],
  NAZA: ["Forza", "Ria"],
  NETA: ["S", "U"],
  NEX: ["EV50"],
  OPEL: ["Astra", "Corsa"],
  ORA: ["Good Cat", "Punk Cat"],
  PEUGEOT: ["208", "3008", "5008"],
  POLARSUN: ["Gabriel"],
  PORSCHE: ["911", "Cayenne", "Macan"],
  PROTON: ["Persona", "Saga"],
  RENAULT: ["Clio", "Megane", "Koleos"],
  "ROLLS-ROYCE": ["Phantom", "Ghost", "Cullinan"],
  ROVER: ["75"],
  SAAB: ["9-3", "9-5"],
  SEAT: ["Ibiza", "Leon"],
  SKODA: ["Octavia", "Kodiaq"],
  SMART: ["Fortwo", "Forfour"],
  SPYKER: ["C8"],
  SSANGYONG: ["Rexton", "Korando"],
  SUBARU: ["Forester", "Impreza", "Outback"],
  TATA: ["Nexon", "Harrier"],
  TESLA: ["Model 3", "Model S", "Model X", "Model Y"],
  THAIRUNG: ["Adventure Master"],
  VOLKSWAGEN: ["Golf", "Passat", "Tiguan"],
  VOLT: ["City EV"],
  VOLVO: ["XC40", "XC60", "S90"],
  WULING: ["Hongguang", "Cortez"]
};

const RegisterPage: FC = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();

  const [carModels, setCarModels] = useState<string[]>([]); // Dynamic car models
  const [selectedCarBrand, setSelectedCarBrand] = useState<string | null>(null);

  const [isChecked, setIsChecked] = useState(false); // New state for the checkbox


  useEffect(()=>{
    console.log("RegisterPage :", id)
    form.setFieldsValue({ parentId: id });
  }, [id])

  const [onMutationRegister] = useMutation(mutationRegister, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { register } }) => {
      console.log("RegisterPage :", register);
      message.success('Register successfully!');
      setLoading(false);

      navigate(`/login${'?from=' + encodeURIComponent(location.pathname)}`, { replace: true })
    },
    onError(error) {
      // console.error(error);
      // message.error('An error occurred while updating the profile.');

      setLoading(false);

      handlerError({}, error)
    }
  });

  const handleSubmit = async (input: any) => {
    console.log("handlerSubmit :", input);
    
    setLoading(true);
    onMutationRegister({ variables: { input } });
  };

  const handleCarBrandChange = (value: string) => {
    setSelectedCarBrand(value);
    setCarModels(carModelsData[value] || []);
    form.setFieldsValue({ car_model: undefined }); // Reset car model when brand changes
  };

  return (
    <Layout className="layout-page">
    <div className="register-page">
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
        layout="vertical"
        className="register-page-form"
      >
        <h2>REGISTER</h2>
        <Form.Item
          name="parentId"
          initialValue={initialValues.parentId}
          style={{ display: 'none' }}
        >
          <Input type="hidden" />
        </Form.Item>

        {/* ชื่อ-นามสกุล (ภาษาไทย) */}
        <Form.Item
          name="username"
          label="Name Surname"
          rules={[
            { required: true, message: 'Please input your name surname!' },
            // { pattern: userNameRegex, message: "Only allows letters (both uppercase and lowercase) and numbers" }
          ]}
        >
          <Input />
        </Form.Item>

        {/* เลขที่บัตรประชาชน */}
        <Form.Item
          name="idCard"
          label="ID Card"
          rules={[
            { required: true, message: 'Please input your ID card!' },
            { pattern: idCardRegex, message: 'ID card number must be 13 digits!' }
          ]}
        >
          <Input />
        </Form.Item>

        {/* อีเมลล์ */}
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
        >
          <Input />
        </Form.Item>

        {/* เบอร์มือถือ */}
        <Form.Item
          name="tel"
          label="Telephone"
          rules={[
            { required: true, message: 'Please input your telephone number!' },
            { pattern: phoneNumberRegex, message: 'Phone number must be 10 digits!' }
          ]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please input your password!' },
            {
              pattern: passwordRegex,
              message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          rules={[
            { required: true, message: 'Please confirm your password!' },
            {
              pattern: passwordRegex,
              message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match!');
              },
            })
          ]}
        >
          <Input.Password />
        </Form.Item> */}

        {/* ยี่ห้อรถยนต์ car_brand */}
        <Form.Item name="car_brand" label="Car Brand">
          <Select onChange={handleCarBrandChange} placeholder="Select Car Brand">
            {Object.keys(carModelsData).map((brand) => (
              <Select.Option key={brand} value={brand}>
                {brand}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* รุ่นรถยนต์ car_model */}
        <Form.Item name="car_model" label="Car Model">
          <Select placeholder="Select Car Model" disabled={!selectedCarBrand}>
            {carModels.map((model) => (
              <Select.Option key={model} value={model}>
                {model}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* วันที่จดทะเบียนรถยนต์ car_date_register */}
        <Form.Item
          name="car_date_register"
          label="Car Date Register"
          // rules={[{ required: true, message: 'Please select a registration date!' }]}
          >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="packages"
          label="Packages"
          rules={[{ required: true, message: 'Please select a packages!' }]}
        >
          <Select defaultValue={1} style={{ width: 120 }}>
            <Select.Option value={1}>1</Select.Option>
            <Select.Option value={2}>8</Select.Option>
            <Select.Option value={3}>57</Select.Option>
            {/* <Select.Option value={4}>343</Select.Option>
            <Select.Option value={5}>2,401</Select.Option>
            <Select.Option value={6}>16,807</Select.Option> */}
          </Select>
        </Form.Item>

        {/* Privacy Checkbox */}
        <Form.Item>
            <Checkbox
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            >
              I agree to the <a href="/privacy-policy" target="_blank">privacy policy</a>.
            </Checkbox>
          </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}  disabled={!isChecked}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
    </Layout>
  );
};

export default RegisterPage;