import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Switch, Card, Select, Row, Col, Typography  } from 'antd';
import moment from "moment";
import { useQuery, useMutation } from "@apollo/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import _ from "lodash"
import { faker } from '@faker-js/faker';
import { useSelector } from 'react-redux';

import { getHeaders, getCookie } from "@/utils"
import { queryMembers, faker_agent, 
        faker_insurance, mutationTest_addmember, 
        mutationMlm, mutation_product } from "@/apollo/gqlQuery"

import  { DefaultRootState } from '@/interface/DefaultRootState';
// import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import SaleOrderPDF from './PDF';


interface SaleItem {
    id: number;
    name: string;
    amount: number;
    checked: boolean;
  }

interface UserType {
    _id: string;
}

const { mode, REACT_APP_HOST_GRAPHAL }  = process.env

const Faker: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { profile } = useSelector((state : DefaultRootState) => state.user);

    console.log("profile ", profile)

    const [users, setUsers] = useState<UserType[]>();

    const [onTest_addmember, resultTest_addmember] = useMutation(mutationTest_addmember, {
        context: { headers: getHeaders(location) },
        update: (cache, {data: {test_addmember}}) => { 
            console.log("onTest_addmember ")
        },
        onCompleted( data ) {
        //   history.goBack()
        },
        onError(error){
          console.log("onTest_addmember onError :", error)
        }
    });

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

    
    const [onProduct] = useMutation(mutation_product, {
        context: { headers: getHeaders(location) },
        update: (cache, { data: { product } }) => {
          console.log("product:", product);
        },
        onCompleted: (data) => {
        },
        onError: (error) => {
        }
    });

    // const [onMlm, resultMlm] = useMutation(mutationMlm, { 
    //     context: { headers: getHeaders(location) },
    //     onCompleted: async(datas)=>{
    //         console.log("onCompleted :", datas)
    //         // let {status, data, sessionId} = datas.login
    //         // if(status){
    //         //     // localStorage.setItem('usida', sessionId)
    //         //     setCookie('usida', sessionId)
    //         //     updateProfile(data)
    //         // }

    //         // onMlm({ variables: { input: { parentId: selectedOption }} })

    //         // navigate("/")
    //     },
    //     onError(err){
    //         console.log("onError :", err)
    //     }
    // });

    const { loading: loadingMembers, 
        data: dataMembers, 
        error: errorMembers  } =  useQuery(   queryMembers, {
                                            context: { headers: getHeaders(location) },
                                            fetchPolicy: 'cache-first', 
                                            nextFetchPolicy: 'network-only', 
                                            notifyOnNetworkStatusChange: false,
                                        });

    useEffect(() => {
        if(!loadingMembers){
            if(!_.isEmpty(dataMembers?.members)){
                setUsers([])
                if(dataMembers.members.status){
                    
                    _.map(dataMembers.members.data, (e, key)=>{
                        
                        // const newItem: any = {key, displayName: e.current.displayName, email: e.current.email, avatar: e.current.avatar?.url,  roles: e.current.roles, timestamp:e.updatedAt}; 
                        // console.log("e :", e, newItem)
                        setUsers((prevItems) => {
                            if (Array.isArray(prevItems)) { // Check if prevItems is an array
                                return [...prevItems, e];
                            } else {
                                console.error('prevItems is not an array:', prevItems);
                                return [e]; // Fallback to ensure it is always an array
                            }
                        });
                    })
                }
            }
        }
    }, [dataMembers, loadingMembers])

    useEffect(()=>{
        console.log("users :", users)
    }, [users])

    const onFinishMember = (values: any) => {
        console.log('onFinishMember Received values:', values);
        // Here you can handle form submission (e.g., send data to an API)

        for ( var i = 0; i < 20; i++ ) {
            let name = faker.name.firstName().toLowerCase()

            const parentId = users ? users[Math.floor(Math.random() * users.length)]._id : undefined;
            let newInput =  {
                parentId,
                displayName: faker.name.firstName(),
                email: faker.internet.email(),
                password: name,
                username: name,
                idCard: faker.datatype.uuid(),
                tel: faker.phone.phoneNumber(),
                avatar: {
                    url: faker.image.avatar(),
                    filename: faker.name.firstName(),
                    encoding: '7bit',
                    mimetype: 'image/png'
                }
            }
            onTest_addmember({ variables: { input: newInput } });
        }
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

    const onFinishProduct=  (values: any) => {

        /*
        name: string;
        detail: string;
        plan: number[];
        price: number;
        packages: number[];
        images: RcFile[];
        */

        const plans = [1, 2];
        const pakg = [1, 2 ,3];

        const generate_img=(leth: number) =>{
            let imgs:any[] = []
            for ( var i = 0; i < leth; i++ ) {
                if(profile._id !== undefined){
                    imgs = [...imgs, {
                        userId: profile._id,
                        url: faker.image.avatar(),
                        filename: faker.name.firstName(),
                        encoding: '7bit',
                        mimetype: 'image/png'
                    }]
                }
                
            }
            return imgs
        }

        for ( var i = 0; i < 200; i++ ) {
            let newInput = {
                name: faker.name.jobTitle(),
                detail: faker.name.jobTitle(),
                plan:  [plans[Math.floor(Math.random() * plans.length)]],
                price: faker.commerce.price(),
                packages: [pakg[Math.floor(Math.random() * pakg.length)]],
                images: generate_img( Math.floor(Math.random() * (10 - 1 + 1)) + 1 ),
                quantity: Math.floor(Math.random() * 1000) + 100
            }

            console.log("newInput :", newInput)
            onProduct({ variables: { input: { mode:'added', _isDEV: true, current: newInput }  } });
        }
    }

    const sampleData = [
        { code: 'A001', description: 'Item 1', quantity: 2, unit: 'pcs', unitPrice: 10.0 },
        { code: 'A002', description: 'Item 2', quantity: 5, unit: 'pcs', unitPrice: 15.0 },
        // Add more items as needed
    ];
    

    const saleItems: SaleItem[] = [
        { id: 1, name: 'Product A', amount: 50, checked: true },
        { id: 2, name: 'Product B', amount: 30, checked: false },
        { id: 3, name: 'Product C', amount: 20, checked: true },
        // Add more items as needed
      ];

    return (
        <div>
            <Card title="Create Member" style={{ marginBottom: '10px' }}>
                <Form layout="vertical" onFinish={onFinishMember}>
                    <Form.Item>
                        <Button disabled={_.isEmpty(users) ? true : false} type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card title="Create Agent" style={{ marginBottom: '10px' }}>
                <Form layout="vertical" onFinish={onFinishAgent}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card title="Create Insurance" style={{ marginBottom: '10px' }}>
                <Form layout="vertical" onFinish={onFinishInsurance}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card title="Create Product" style={{ marginBottom: '10px' }}>
                <Form layout="vertical" onFinish={onFinishProduct}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Card>


            <div style={{ padding: 20 }}>
    <h1>Download Sale Order PDF</h1>
    {/* <PDFViewer width="100%" height="600">
        <SaleOrderPDF  />
      </PDFViewer> */}
      {/* <PDFDownloadLink document={<SaleOrderPDF data={sampleData} />} fileName="full-screen-table.pdf">
        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
      </PDFDownloadLink> */}

{/* <PDFDownloadLink document={<SaleOrderPDF items={saleItems} />} fileName="sale-report.pdf">
      {({ loading }) => (loading ? 'Loading document...' : 'Download Sale Report')}
    </PDFDownloadLink> */}

{/* <SaleOrderPDF content={content} /> */}
  </div>
        </div>
    );
};

export default Faker;