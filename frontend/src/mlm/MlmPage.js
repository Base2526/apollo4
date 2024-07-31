import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from "@apollo/client";
import { useDeviceData } from "react-device-detect";
import _ from "lodash";

import { queryMembers, mutationMlm } from "../apollo/gqlQuery"
import { getHeaders, handlerErrorApollo } from "../util"

const MlmPage = (props) => {
    const deviceData = useDeviceData();
    const navigate = useNavigate();
    const location = useLocation();
    const [dataUsers, setDataUsers]  = useState([]);
    const [selectedOption, setSelectedOption]    = useState("");
    const { user } = props
    
    const { loading: loadingMembers, 
            data: dataMembers, 
            error: errorMembers, 
            networkStatus: networkStatusMembers,
            fetchMore: fetchMoreMembers } = useQuery(queryMembers, 
                                                    { 
                                                        context: { headers: getHeaders(location) }, 
                                                        // variables: {input},
                                                        fetchPolicy: 'network-only', 
                                                        nextFetchPolicy: 'cache-first', 
                                                        notifyOnNetworkStatusChange: true
                                                    }
                                                );

    if(!_.isEmpty(errorMembers)) handlerErrorApollo( props, errorMembers )

    useEffect(() => {
        if(!loadingMembers){
            if(!_.isEmpty(dataMembers?.members)){
                let { status, data } = dataMembers?.members
                if(status) {
                    setDataUsers(_.filter(data, (el)=>el?._id !== user?._id))
                }
            }
        }
    }, [dataMembers, loadingMembers])

    const [onMlm, resultMlm] = useMutation(mutationMlm, { 
        context: { headers: getHeaders(location) },
        onCompleted: async(datas)=>{
            console.log("onCompleted :", datas)
            // let {status, data, sessionId} = datas.login
            // if(status){
            //     // localStorage.setItem('usida', sessionId)
            //     setCookie('usida', sessionId)
            //     updateProfile(data)
            // }

            navigate("/")
        },
        onError(err){
            console.log("onError :", err)
        }
    });

    const handleSubmit = (event) =>{
        event.preventDefault();    
        onMlm({ variables: { input: { parentId: selectedOption }} })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="d-flex form-input">
                    <label>Select Parent :</label>
                    <div className="position-relative wrapper-form">
                        <select 
                            defaultValue={""}
                            value={selectedOption} // ...force the select's value to match the state variable...
                            onChange={e =>{
                                setSelectedOption(e.target.value)
                            } } >
                            {
                                dataUsers.map((val, index)=>{ 
                                                                if(index === 0){
                                                                    return <option key={index} value="">Select an option</option> 
                                                                }
                                                                return <option key={index} value={val?._id}>{val?.current?.displayName}-{val?.current?.email}</option> 
                                                            })
                            }
                        </select>
                    </div>
                </div>
                <button type="submit" disabled={_.isEmpty(selectedOption) ? true : false}>Add</button> 
            </form>
        </div>
    );
}

export default MlmPage;
