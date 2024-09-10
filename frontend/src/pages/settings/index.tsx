// Settings.tsx
import React from 'react';
import { Form, Input, Button, Checkbox, Switch, Card, Select  } from 'antd';

import { Row, Col, Typography } from 'antd';

const { Title, Paragraph } = Typography;

import { faker } from '@faker-js/faker';
// import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from "@apollo/client";


import { getHeaders, getCookie } from "../../utils"
import { faker_agent, faker_insurance } from "../../apollo/gqlQuery"

const { Meta } = Card;

interface CardItem {
    title: string;
    description: string;
    imageUrl: string;
}

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();

    const [onFakerAgent, resultFakerAgent] = useMutation(faker_agent, {
        context: { headers: getHeaders(location) },
        update: (cache, {data: {faker_agent}}) => { 
            console.log("faker_agent ", faker_agent)
        },
        onCompleted( data ) {
        //   history.goBack()
        },
        onError(error){
          console.log("faker_agent onError :", error)
        }
    });

    const [onFakerInsurance, resultFakerInsurance] = useMutation(faker_insurance, {
        context: { headers: getHeaders(location) },
        update: (cache, {data: {faker_insurance}}) => { 
            console.log("faker_insurance ", faker_insurance)
        },
        onCompleted( data ) {
        //   history.goBack()
        },
        onError(error){
          console.log("faker_insurance onError :", error)
        }
    });

    const onFinish = (values: any) => {
        console.log('onFinish Received values:', values);
        // Here you can handle form submission (e.g., send data to an API)
    };

    const onFinishAgent = (values: any) => {
        console.log('onFinishAgent Received values:', values);
        // Here you can handle form submission (e.g., send data to an API)

        const prefixs = ['mr', 'ms', 'mrs']
        const status  = ['active', 'inactive', 'pending']
        const agentTypes = ['agent', 'broker', 'distributor']
        const saleStatus = ['completed', 'pending', 'canceled']
        
        for ( var i = 0; i < 100; i++ ) {
            let newInput = {
                            code: faker.datatype.uuid(),
                            prefix: prefixs[Math.floor(Math.random() * prefixs.length)],
                            address: faker.address.streetAddress(),
                            province: faker.address.state(),
                            district: faker.address.state(),
                            firstName: faker.name.firstName(),
                            lastName: faker.name.lastName(),
                            subDistrict: faker.name.lastName(),
                            postalCode: faker.address.zipCode(),
                            status: status[Math.floor(Math.random() * status.length)],
                            agentType: agentTypes[Math.floor(Math.random() * agentTypes.length)],
                            mobile: faker.phone.phoneNumber(),
                            licenseNumber: faker.datatype.uuid(),
                            idCardNumber: faker.datatype.uuid(),
                            phone: faker.phone.phoneNumber(),
                            collateralAmount: faker.datatype.number({ min: 1000, max: 100000 }),
                            creditLimit: faker.datatype.number({ min: 1000, max: 100000 }),
                            email: faker.internet.email(),
                            multipleAmount: faker.datatype.number({ min: 1, max: 10 }),
                            availableCredit: faker.datatype.number({ min: 0, max: 100000 }),
                            lineupAgent: faker.name.findName(),
                            seiBrokerCode: faker.datatype.uuid(),
                            sjaBrokerCode: faker.datatype.uuid(),
                            salesAmount: faker.datatype.number({ min: 0, max: 1000 }),
                            paymentAmount: faker.datatype.number({ min: 0, max: 1000 }),
                            remainingCredit: faker.datatype.number({ min: 0, max: 1000 }),
                            oldCode: faker.datatype.uuid(),
                            remarks: faker.lorem.sentence(),
                            salesStatus: saleStatus[Math.floor(Math.random() * saleStatus.length)],
                        }

            console.log("newInput :", newInput)
            onFakerAgent({ variables: { input: newInput } });
        }
    };

    const onFinishInsurance = (values: any) => {
        console.log('onFinishInsurance Received values:', values);
        // Here you can handle form submission (e.g., send data to an API)

        const types = ['normal', 'juristic']
        const evidences  = ['id card', 'passport']
        const titles = ['mr', 'mrs', 'miss']
        const genders = ['-', 'male', 'female']

        for ( var i = 0; i < 100; i++ ) {
            let newInput = {
                policyNumber: faker.datatype.uuid(),
                type: types[Math.floor(Math.random() * types.length)],
                evidence: evidences[Math.floor(Math.random() * evidences.length)],
                number: faker.datatype.number().toString(),
                houseNumber: faker.datatype.number().toString(),
                group: faker.datatype.number().toString(),
                title: titles[Math.floor(Math.random() * titles.length)],
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                village: faker.address.streetName(),
                alley: faker.address.streetName(),
                soi: faker.address.streetName(),
                province: faker.address.state(),
                district: faker.address.city(),
                subDistrict: faker.address.city(),
                postalCode: faker.address.zipCode(),
                mobile: faker.phone.phoneNumber(),
                phone: faker.phone.phoneNumber(),
                occupation: faker.name.jobTitle(),
                businessAddress: faker.address.streetAddress(),
                branch: faker.address.city(),
                birthDate: faker.date.past(30),
                gender: genders[Math.floor(Math.random() * genders.length)],
                nationality: 'Thai',
                companyManager: faker.name.findName(),
                idNumber: faker.datatype.number().toString(),
                dob: faker.date.past(30),
                registeredAddress: faker.address.streetAddress(),
                currentAddress: faker.address.streetAddress(),
                vehicleCode: faker.datatype.uuid(),
                coverageStartDate: faker.date.future(),
                coverageEndDate: faker.date.future(),
                contractDate: faker.date.recent(),
                vehicleName: faker.vehicle.vehicle(),
                vehicleModel: faker.vehicle.model(),
                vehicleYear: faker.date.past(20).getFullYear(),
                vehicleColor: faker.vehicle.color(),
                plateType: faker.name.firstName(),
                vehicleType: 'normal',
                vehicleCountry: 'thai',
                chassisNumber: faker.datatype.uuid(),
                registrationNumber1: faker.datatype.uuid(),
                registrationNumber2: faker.datatype.uuid(),
                registrationProvince: faker.address.state(),
                cc: faker.datatype.number({ min: 100, max: 5000 }),
                seats: faker.datatype.number({ min: 2, max: 8 }),
                weight: faker.datatype.number({ min: 500, max: 3000 }),
                days: 365,
                expenses: parseFloat(faker.finance.amount(0, 10000, 2)),
            }

            console.log("newInput :", newInput)
            onFakerInsurance({ variables: { input: newInput } });
        }
    };

    const cardsData = [
        { title: 'ตัวแทน', details: 'ตัวแทน', path: "/settings/listagent" },
        { title: 'โครงสร้างตัวแทน', details: 'โครงสร้างตัวแทน' },
        { title: 'คำนำหน้า', details: 'คำนำหน้า' },
        { title: 'จังหวัด/อำเภอ/ตำบล', details: 'จังหวัด/อำเภอ/ตำบล' },
        { title: 'รายการรถ', details: 'รายการรถ' },
        { title: 'รายการรุ่นรถ', details: 'รายการรุ่นรถ' },
        { title: 'รายการรหัสรถ', details: 'รายการรหัสรถ' },
        { title: 'รายการสีรถ', details: 'รายการสีรถ' },
        { title: 'Package รถยนต์', details: 'Package รถยนต์' },
        { title: 'กลุ่มรถตามค่าคอมมิชชั่น', details: 'กลุ่มรถตามค่าคอมมิชชั่น' },
        { title: 'ตารางผลประโยชน์', details: 'ตารางผลประโยชน์' },
        { title: 'วงเงินสด', details: 'วงเงินสด' },
        { title: 'ประวัติรายการเคลื่อนไหว', details: 'ประวัติรายการเคลื่อนไหว' },
        { title: 'นำเข้าข้อมูล', details: 'นำเข้าข้อมูล' },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={16}>
                {cardsData.map((card, index) => (
                    <Col span={5} key={index} style={{"margin": "3px"}}>
                        <Card hoverable 
                            title={card.title} 
                            bordered={false} 
                            onClick={()=>{
                                if (card.path) {
                                    navigate(card.path);
                                }
                            }}>
                            <p>{card.details}</p>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )

};

export default SettingsPage;