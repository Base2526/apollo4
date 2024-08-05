import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import _ from "lodash"
import { useQuery, useMutation } from "@apollo/client";
import { getHeaders, handlerErrorApollo, getCookie } from "../util"
import { mutationLottery, queryManageLotterys, mutationRegister, queryMembers, mutationTest_addmember } from "../apollo/gqlQuery"

const { faker } = require("@faker-js/faker");

const FakerPage = (props) => {
    const location              = useLocation();
    const [users, setUsers]     = useState([]); 
    const [manageLotterys, setManageLotterys] = useState([]); 
 
    // refetchMembers(/*{ids: bankIds}*/);
    // const { loading: loadingMembers, 
    //         data: dataMembers, 
    //         error: errorMembers,
    //         refetch: refetchMembers,
    //         networkStatus } = useQuery(queryMembers, 
    //                                     { 
    //                                     context: { headers: getHeaders(location) }, 
    //                                     // variables: {input: { OFF_SET: 0, LIMIT: 1000 }},
    //                                     fetchPolicy: 'cache-first', 
    //                                     nextFetchPolicy: 'network-only',
    //                                     notifyOnNetworkStatusChange: true
    //                                     }
    //                                 );
    // if(!_.isEmpty(errorMembers)) handlerErrorApollo( props, errorMembers )
    // const { loading: loadingManageLotterys, 
    //         data: dataManageLotterys, 
    //         error: errorManageLotterys,
    //         networkStatus: networkStatusManageLotterys } = useQuery( queryManageLotterys, { 
    //                                                                 context: { headers: getHeaders(location) }, 
    //                                                                 fetchPolicy: 'cache-first', 
    //                                                                 nextFetchPolicy: 'network-only', 
    //                                                                 notifyOnNetworkStatusChange: true }
    //                                                                 );

    const [onMutationLottery, resultLottery] = useMutation(mutationLottery, {
        context: { headers: getHeaders(location) },
        update: (cache, {data: {lottery}}) => { },
        onCompleted(data) {
            console.log("onCompleted :", data)
        },
        onError(error){
            console.log("onError :", error)
        }
    });

    const [onRegister, resultRegister] = useMutation(mutationRegister, {
        context: { headers: getHeaders(location) },
        update: (cache, {data: {register}}) => { },
        onCompleted( data ) {
        //   history.goBack()
        },
        onError(error){
          console.log("onRegister onError :", error)
        }
    });

    // 
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

    // console.log("getCookie('usida') >", getCookie('usida'))

    // useEffect(() => {
    //     if(!loadingMembers){
    //       if(!_.isEmpty(dataMembers?.members)){
    //         let { status, data } = dataMembers?.members
    //         // if(status)setUsers(data)
    //       }
    //     }

    //     console.log("useEffect :", dataMembers, loadingMembers)
    // }, [dataMembers, loadingMembers ])

    // useEffect(() => {
    //     if(!loadingManageLotterys){
    //       if(!_.isEmpty(dataManageLotterys?.manageLotterys)){
    //         let { status, data } = dataManageLotterys?.manageLotterys
    //         if(status)setManageLotterys(data)
    //       }
    //     }
    // }, [dataManageLotterys, loadingManageLotterys])

    const makeFile = (length) =>{
        let files = []
        for ( var i = 0; i < length; i++ ) {
            files.push({
                          url: faker.image.avatar(),
                          filename: faker.name.firstName(),
                          encoding: '7bit',
                          mimetype: 'image/png'
                        })
        }
        return files
    }

    const makeNumber = (length)=> {
        var result           = '';
        var characters       = '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const randomNumberInRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return(<div className="div-management">
                <div>Auto-Generation</div>
                {/* <div>
                    <button onClick={()=>{
                        for ( var i = 0; i <200; i++ ) {
                            let newInput =  {
                                mode: "NEW",
                                title: faker.lorem.lines(1),
                                price: parseInt(makeNumber(3)),
                                priceUnit: parseInt(makeNumber(2)),
                                description: faker.lorem.paragraph(),
                                manageLottery: manageLotterys[randomNumberInRange(0, manageLotterys.length - 1)]?._id,
                                files: makeFile(5),
                                condition: parseInt(randomNumberInRange(11, 100)),    // 11-100
                                category: parseInt(randomNumberInRange(0, 3)),        // money, gold, things, etc
                                type: parseInt(randomNumberInRange(0, 1)),            // bon, lang
                                ownerId: users[randomNumberInRange(0, users.length - 1)]?._id,
                                test: true,
                            }
                            onMutationLottery({ variables: { input: newInput } });
                        }
                    }}>Auto สร้าง สินค้า</button>
                </div> */}

                <div>
                    <button onClick={()=>{
                        for ( var i = 0; i < 100; i++ ) {
                            let name = faker.name.firstName().toLowerCase()
                            let newInput =  {
                                // username: faker.name.firstName(),
                                // password: faker.name.firstName(),
                                // email: faker.internet.email(),
                                // displayName: faker.name.firstName(),
                                
                                displayName: faker.name.firstName(),
                                email: faker.internet.email(),
                                password: name,
                                username: name,
                                avatar: {
                                    url: faker.image.avatar(),
                                    filename: faker.name.firstName(),
                                    encoding: '7bit',
                                    mimetype: 'image/png'
                                }
                            }

                            // console.log("newInput :", newInput)
                            onTest_addmember({ variables: { input: newInput } });
                        }
                    }}>Auto สร้าง USER</button>
                </div>

                {/* 
                <div>
                    <button onClick={()=>{
                        refetchMembers()
                    }}>refetchMembers</button>
                </div> 
                */}
            </div>)
}

export default FakerPage;