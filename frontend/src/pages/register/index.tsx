import "./index.less";

import React, { FC, useEffect, useState } from 'react';
import { Card, Layout, Form, Input, Button, message, Select, DatePicker, Checkbox,  } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from "@apollo/client";
import { useLocation, useNavigate, useParams} from 'react-router-dom';
import { mutation_register } from "@/apollo/gqlQuery";
import handlerError from "@/utils/handlerError"
import  { DefaultRootState } from '@/interface/DefaultRootState';
import { updateProfile } from '@/stores/user.store';
import { setCookie, getHeaders } from "@/utils";

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

// Define a utility function to create carYearsData
const createCarYearsData = (carModels: Record<string, string[]>): Record<string, number[]> => {
  const years = [2018+ 543, 2019+ 543, 2020+ 543, 2021+ 543, 2022+ 543, 2023+ 543, 2024+ 543]; // Define years for models
  const carYearsData: Record<string, number[]> = {};

  for (const brand in carModels) {
    for (const model of carModels[brand]) {
      carYearsData[model] = years; // Assign years to each model
    }
  }

  return carYearsData;
};
const carYearsData =  createCarYearsData(carModelsData);

type Month = {
  id: number;
  name: string;
};

const months: Month[] = [
  { id: 1, name: 'มกราคม' },
  { id: 2, name: 'กุมภาพันธ์' },
  { id: 3, name: 'มีนาคม' },
  { id: 4, name: 'เมษายน' },
  { id: 5, name: 'พฤษภาคม' },
  { id: 6, name: 'มิถุนายน' },
  { id: 7, name: 'กรกฎาคม' },
  { id: 8, name: 'สิงหาคม' },
  { id: 9, name: 'กันยายน' },
  { id: 10, name: 'ตุลาคม' },
  { id: 11, name: 'พฤศจิกายน' },
  { id: 12, name: 'ธันวาคม' },
];

const privacyContent = `ข้าพเจ้ารับทราบนโยบายคุ้มครองข้อมูลส่วนบุคคล และยินยอมให้บริษัท เบสท์ เอ็กซ์เพรส กรุ๊ป(ประเทศไทย) จำกัด รวมถึงบริษัทในเครือที่เกี่ยวข้องกัน ตลอดจนคู่ค้าทางธุรกิจและ/หรือพันธมิตรของบริษัทเหล่านี้ สามารถเก็บ ใช้ และ/หรือ เปิดเผยข้อมูลส่วนบุคคลและข้อมูลส่วนบุคคลที่มีความอ่อนไหวของข้าพเจ้า ดังนี้
*ข้อมูลอัตลักษณ์เช่น ชื่อ-นามสกุล หมายเลขประจำตัวประชาชน รูปภาพบุคคล เป็นต้น
*ข้อมูลที่อยู่และที่ติดต่อ เช่นเบอร์โทรศัพท์ ที่อยู่ เป็นต้น
*ข้อมูลประวัติ เช่น วันเดือนปีเกิด สถานะพลเมือง เป็นต้น
*ข้อมูลอื่นๆที่เกี่ยวข้อง และ IT เช่น Username Password เป็นต้น ประมวลข้อมูลส่วนบุคคลประเภทพิเศษที่มีความอ่อนไหวในบางกรณี เก็บรวบรวมข้อมูลส่วนบุคคลของเจ้าของข้อมูลส่วนบุคคลผ่านระบบหรืออุปกรณ์ต่างๆเช่น ระบบให้บริการแพลตฟอร์มดิจิทัล <a href="http://www.bestmallu.com">www.bestmallu.com</a>
เพื่อวัตถุประสงค์ในการดำเนินการติดต่อและนำเสนอข้อมูลสำหรับการขายผลิตภัณฑ์ การจัดทำรายการส่งเสริมการขายและการตลาด แจ้งสิทธิประโยชน์หรือข่าวสารต่างๆ แจ้งข้อมูลเกี่ยวกับผลิตภัณฑ์ หรือกรมธรรม์ประกันภัย การใช้ข้อมูลเพื่อพัฒนาผลิตภัณฑ์หรือบริการต่างๆ หรือเพื่อกิจกรรมอื่นๆ ท่านสามารถอ่านรายละเอียดนโยบายคุ้มครองข้อมูลส่วนบุคคลและสิทธิของเจ้าของข้อมูลส่วนบุคคลได้ที่เว็บไซต์ คำประกาศเกี่ยวกับความเป็นส่วนตัว ก่อนให้ความยินยอม ทั้งนี้ ก่อนการแสดงเจตนา ข้าพเจ้าได้อ่านรายละเอียดจากเอกสารชี้แจงข้อมูล หรือได้รับคำอธิบายจากหน่วยงานถึงวัตถุประสงค์ในการเก็บรวบรวม ใช้หรือเปิดเผยข้อมูลส่วนบุคคล (“ประมวลผลข้อมูลส่วนบุคคล”) และมีความเข้าใจดีแล้ว ข้าพเจ้าให้ความยินยอมหรือปฏิเสธไม่ให้ความยินยอมในเอกสารนี้ด้วยความสมัครใจ ปราศจากการบังคับหรือชักจูง และข้าพเจ้าทราบว่าข้าพเจ้าสามารถถอนความยินยอมนี้เสียเมื่อใดก็ได้ เว้นแต่ในกรณีมีข้อจำกัดสิทธิตามกฎหมายหรือยังมีสัญญาระหว่างข้าพเจ้ากับสถาบันที่ให้ประโยชน์แก่ข้าพเจ้าอยู่ กรณีที่ข้าพเจ้าประสงค์จะไม่ให้ความยินยอม ข้าพเจ้าเข้าใจและยอมรับว่า การไม่ให้ความยินยอมจะมีผลทำให้ข้าพเจ้า (เช่น ข้าพเจ้าอาจได้รับความสะดวกในการใช้บริการน้อยลง หรือข้าพเจ้าไม่สามารถเข้าถึงฟังก์ชันการใช้งานบางอย่างได้ เป็นต้น) และข้าพเจ้าทราบว่าการถอนความยินยอมดังกล่าว ไม่มีผลกระทบต่อการประมวลผลข้อมูลส่วนบุคคลที่ได้ดำเนินการเสร็จสิ้นไปแล้วก่อนการถอนความยินยอม โดยข้าพเจ้าให้ถือเอาการกดเลือก “ให้ความยินยอม” ในช่องสนทนา เป็นการแสดงเจตนายินยอมของข้าพเจ้าแทนการลงลายมือชื่อเป็นหลักฐาน รวบรวมเบี้ยประกัน และผลิตภัณฑ์อื่นๆ อาศัยฐานความยินยอมเพื่อประมวลผลข้อมูลของเจ้าของข้อมูลส่วนบุคคลตามวัตถุประสงค์ที่เปลี่ยนแปลง หรือเพิ่มเติมนั้น จะดำเนินการขอความยินยอมจากเจ้าของข้อมูลส่วนบุคคล  “ ให้ความยินยอม” ข้าพเจ้ารับทราบข้อมูลดังกล่าวและยืนยันการแสดงความยินยอมตามที่ได้เลือกไว้`;

const RegisterPage: FC = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();

  const { logged } = useSelector((state: DefaultRootState) => state.user);
  const [carModels, setCarModels] = useState<string[]>([]); // Dynamic car models
  const [selectedCarBrand, setSelectedCarBrand] = useState<string | null>(null);
  const [selectedCarModel, setSelectedCarModel] = useState<string | null>(null);
  const [carYears, setCarYears] = useState<number[]>([]);
  const [availableMonths, setAvailableMonths] = useState<Month[]>(months); // All months initially

  const [isChecked, setIsChecked] = useState(false); // New state for the checkbox

  useEffect(()=>{
    if(logged){
      navigate(`/`, { replace: true })
    }
  }, [])

  useEffect(()=>{
    console.log("RegisterPage :", id)
    form.setFieldsValue({ parentId: id });
  }, [id])

  // Function to handle links with target="_blank"
  const handleLinks = (content: string) => {
    console.log("content :", content)
    return content.replace(
      /<a href="(.*?)"(.*?)>(.*?)<\/a>/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"$2>$3</a>'
    );
  };

  const [onMutationRegister] = useMutation(mutation_register, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { register } }) => {
      console.log("RegisterPage :", register);

      let { status, data: profile, sessionId } = register
      if(status){
        message.success('Register successfully!');
        setLoading(false);

        setCookie('usida', sessionId);
        dispatch(updateProfile({ profile }));
        navigate("/", { replace: true });
      }
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

  // const handleCarBrandChange = (value: string) => {
  //   setSelectedCarBrand(value);
  //   setCarModels(carModelsData[value] || []);
  //   form.setFieldsValue({ car_model: undefined }); // Reset car model when brand changes
  // };

  const handleCarBrandChange = (value: string) => {
    setSelectedCarBrand(value);
    setCarModels(carModelsData[value] || []);
    form.setFieldsValue({ car_model: undefined, car_year_model: undefined }); // Reset car model and year when brand changes
    setSelectedCarModel(null);
    setCarYears([]);
  };

  const handleCarModelChange = (value: string) => {
    setSelectedCarModel(value);
    setCarYears(carYearsData[value] || []); // Update car years based on selected model
    form.setFieldsValue({ car_year_model: undefined }); // Reset year when model changes
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
        <h2>สมัครสมาชิก</h2>
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
          label="ชื่อ-นามสกุล"
          rules={[
            { required: true, message: 'กรุณากรอก ชื่อ-นามสกุล!' },
            // { pattern: userNameRegex, message: "Only allows letters (both uppercase and lowercase) and numbers" }
          ]}
          help="หมายเหตุ." 
        >
          <Input />
        </Form.Item>

        {/* เลขที่บัตรประชาชน  */}
        <Form.Item
          name="idCard"
          label="เลขที่บัตรประชาชน/พาสปอร์ต"
          rules={[
            { required: true, message: 'Please input your ID card!' },
            { pattern: idCardRegex, message: 'ID card number must be 13 digits!' }
          ]}
          help="หมายเหตุ." 
        >
          <Input />
        </Form.Item>

        {/* อีเมลล์ */}
        <Form.Item
          name="email"
          label="อีเมลล์"
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
          help="หมายเหตุ." 
        >
          <Input />
        </Form.Item>

        {/* เบอร์มือถือ */}
        <Form.Item
          name="tel"
          label="เบอร์โทรศัพท์"
          rules={[
            { required: true, message: 'Please input your telephone number!' },
            { pattern: phoneNumberRegex, message: 'Phone number must be 10 digits!' }
          ]}
          help="หมายเหตุ." 
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

        {/* 
        // ระบุยี่ห้อรถ
        car_brand: { type: String },
        // เลือกรุ่นรถ
        car_model: { type: String },
        // เลือกปีรุ่น
        car_year_model: { type: String },
        // เลือกรุ่นย่อย
        car_sub_model: { type: String },
        // เดือนที่ประกันภัยของท่านหมดอายุ
        car_date_register:  { type : Date, default: Date.now },
        */}

        {/* ยี่ห้อรถยนต์ car_brand */}
        <Form.Item 
          name="car_brand" 
          label="ระบุยี่ห้อรถ"
          help="หมายเหตุ." >
          <Select placeholder="-- เลือก --" onChange={handleCarBrandChange} >
            <Select.Option key="-1" value={""}>-- เลือก --</Select.Option>
            {Object.keys(carModelsData).map((brand) => (
              <Select.Option key={brand} value={brand}>
                {brand}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* รุ่นรถ car_model */}
        <Form.Item
          name="car_model"
          label="รุ่นรถ"
          help="หมายเหตุ."
          >
          <Select placeholder="-- เลือก --" onChange={handleCarModelChange} disabled={!selectedCarBrand}>
            <Select.Option key="-1" value={""}>-- เลือก --</Select.Option>
            {carModels.map(model => (
              <Select.Option key={model} value={model}>{model}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* เลือกปีรุ่น car_year_model  */}
        <Form.Item
          name="car_year_model"
          label="ปีรุ่นรถ"
          help="หมายเหตุ."
        >
          <Select placeholder="-- เลือก --" disabled={!selectedCarModel}>
            <Select.Option key="-1" value={""}>-- เลือก --</Select.Option>
            {carYears.map(year => (
              <Select.Option key={year} value={year}>{year}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* เดือนที่หมดอายุ car_month_expired */}
        <Form.Item
            name="car_month_expired"
            label="เดือนที่หมดอายุ"
            help="หมายเหตุ."
          >
            <Select placeholder="-- เลือก --" disabled={!selectedCarModel}>
            <Select.Option key="-1" value={""}>-- เลือก --</Select.Option>
              {availableMonths.map(month => (
                <Select.Option key={month.id} value={month.id}>{month.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

        <Form.Item
          name="packages"
          label="Packages"
          // rules={[{ required: true, message: 'Please select a packages!' }]}
          help="หมายเหตุ.">
          <Select defaultValue={1} style={{ width: 120 }}>
            <Select.Option value={1}>1</Select.Option>
            <Select.Option value={2}>8</Select.Option>
            <Select.Option value={3}>57</Select.Option>
          </Select>
        </Form.Item>

        {/* Privacy Checkbox */}
        <Form.Item>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Checkbox
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                style={{ marginRight: 8, transform: 'scale(1.5)' }} // Adjusts spacing between Checkbox and TextArea
              />
              <div
                contentEditable
                dangerouslySetInnerHTML={{ __html: privacyContent }}
                style={{
                  border: '1px solid #ddd',
                  padding: '10px',
                  height: '120px',
                  overflowY: 'auto',
                  resize: 'none',
                  maxHeight: '120px',
                  borderRadius: 5,
                  color:'black'
                }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'A') {
                    e.preventDefault(); // Prevent default anchor behavior
                    const anchor = target as HTMLAnchorElement; // Cast to HTMLAnchorElement
                    window.open(anchor.href, '_blank'); // Open link in new tab
                  }
                }}
              />
            </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}  disabled={!isChecked}>สมัครสมาชิก</Button>
        </Form.Item>
      </Form>
    </div>
    </Layout>
  );
};

export default RegisterPage;