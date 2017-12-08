import React, { Component } from 'react';
import {ObjContainer} from "../../services/object_container";

export class LoginPage extends Component{
    constructor(){
        super();

    }
    login(){
        ObjContainer.resolve("user_manager").login();
        ObjContainer.resolve("nav").emit("try_login");
    }
    render(){
        return (
            <div className={"container-fluid"} style={{marginTop: "100px auto", width:"500px"}}>
                <div className={"row"}>
                    <div className={"col-md-12"}>
                        <h2>Login</h2>
                    </div>
                </div>
                <div className={"row"}>

                    <div className={"col-md-12"}>
                        <input className={"form-control"} type={"text"} placeholder={"User Name"}  />
                    </div>

                </div>
                <br/>
                <div className={"row"}>
                    <div className={"col-md-12"}>
                        <input className={"form-control"} type={"password"} placeholder={"Password"}  />
                    </div>
                </div>
                <br/>
                <button className={"btn btn-primary"} onClick={this.login.bind(this)}>Login</button>
            </div>
        )
    }
}