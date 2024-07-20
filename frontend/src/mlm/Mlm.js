import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useApolloClient } from "@apollo/client";
import { useDeviceData } from "react-device-detect";
import _ from "lodash";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LockIcon from '@mui/icons-material/Lock';

import { mutationMlm } from "../apollo/gqlQuery"
import { setCookie, getHeaders } from "../util"

const Mlm = (props) => {
    const deviceData = useDeviceData();
    const navigate = useNavigate();
    const location = useLocation();

    let { user, updateProfile } = props

    console.log("props :", props)

    let [input, setInput]   = useState({ parentId: "" });
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

    // const handleLogin = () => {
    //     if (username === 'user' && password === 'password') {
    //     localStorage.setItem('auth', 'true');
    //     navigate('/');
    //     } else {
    //     alert('Invalid credentials');
    //     }
    // };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
          ...prev,
          [name]: value
        }));
    };

    const handleSubmit = (event) =>{
        event.preventDefault();    

        console.log("parent :", input)
        onMlm({ variables: { input: { parentId: input.parentId }} })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>MLM</h2>
                <div className="d-flex form-input">
                    <label>Parent</label>
                    <div className="position-relative wrapper-form">
                        <input type="text" name="parentId" className="input-bl-form" value={input.parentId} onChange={onInputChange} required />
                        <AccountCircle />
                    </div>
                </div>
                <button type="submit">Add</button> 
            </form>
        </div>
    );
}

export default Mlm;
