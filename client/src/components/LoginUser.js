import React, {useEffect, useState} from 'react';
import axios from "axios";

const LoginUser = ({}) => {
    const getData = async () => {

        const config = {
            headers: {
                "username": "",
                "password": "",
            },
        };
        axios.post('/api/authentication/login', {
            username: "",
            password: ""
        })
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        });
    };
};

export default LoginUser;