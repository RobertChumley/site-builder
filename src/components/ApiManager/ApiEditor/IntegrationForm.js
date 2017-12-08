import React, { Component } from 'react';
import {ObjContainer} from "../../../services/object_container";
import TimesCircle from 'react-icons/lib/fa/times-circle';
import {ExternalApiRequest} from "../../../services/external_api_request";

let DropDownList = (params)=>{
    return (
        <span className="dropdown">
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                {params.value.display || "Selct One..."}
                &nbsp;<span className="caret"/>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                <li><a className="nav-link" onClick={params.onChange.bind(this,{display:"",value:""})} name={params.name} >None</a></li>
                {(params.options|| []).map((option,index) =>{
                    return <li key={"relation_option_value_" + index}>
                        <a className="nav-link" onClick={params.onChange.bind(this,option)} name={params.name} >{option.display}</a>
                    </li>;
                })}
            </ul>
        </span>
    )
};
export class HeaderCollectionDefine extends Component{
    constructor(props){
        super();
        console.log("param props", props);
        this.state = {res:{},relations:[], child_collection: props.value || {routes:[]},obj:{} };

    }
    async componentDidMount(){

    }
    _saveRoute(e){
        let obj = this.props.value;
        obj[this.props.name] = obj[this.props.name] || [];
        obj[this.props.name].push(this.state.obj);
        this.state.obj = {api_key: '',api_dest:''};
        this.setState({obj:this.state.obj});
        if(this.props.onChange)
            this.props.onChange(this.props.name,this.props.field_code, obj,e);
    }

    onRoutesTextChange(e){
        this.state.obj[e.target.name] = e.target.value;
        this.setState({obj: this.state.obj});
    }
    _delete(item, index, e){
        let obj = this.props.value;
        obj[this.props.name].splice(index, 1);
        if(this.props.onChange)
            this.props.onChange(this.props.name,this.props.field_code, obj,e);
    }
    render(){
        return (
            <div>
                <label>Api Key</label><input type={"text"}  className="form-control" onChange={this.onRoutesTextChange.bind(this)}
                                               name={"api_key"} value={this.state.obj["api_key"]} /><br/>
                <label>Api Dest</label><input type={"text"}  className="form-control" onChange={this.onRoutesTextChange.bind(this)}
                                                name={"api_dest"} value={this.state.obj["api_dest"]} /><br/>
                <button className={"btn btn-primary"} onClick={this._saveRoute.bind(this)}>Save</button>
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th /><th>Api Key</th><th>Api Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(this.props.value[this.props.name] || []).map((route,index)=>{
                        return (
                            <tr key={"child_route_" + index}>
                                <td><a className="nav-link" onClick={this._delete.bind(this, route, index)} ><TimesCircle/></a></td><td>{route.api_key}</td><td>{route.api_dest}</td>
                            </tr>);
                    })}
                    </tbody>
                </table>

            </div>);
    }
}

export class MappingCollectionDefine extends Component{
    constructor(props){
        super();
        console.log("param props", props);
        this.state = {relations:[], child_collection: props.value || {routes:[]},obj:{} };
    }
    async componentDidMount(){
    }
    _saveRoute(e){
        let obj = this.props.value;
        obj[this.props.name] = obj[this.props.name] || [];
        obj[this.props.name].push(this.state.obj);
        this.state.obj = {source: '',target:''};
        this.setState({obj:this.state.obj});
        if(this.props.onChange)
            this.props.onChange(this.props.name,this.props.field_code, obj,e);
    }
    onRoutesTextChange(e){
        this.state.obj[e.target.name] = e.target.value;
        this.setState({obj: this.state.obj});
    }
    _delete(item, index, e){
        let obj = this.props.value;
        obj[this.props.name].splice(index, 1);
        if(this.props.onChange)
            this.props.onChange(this.props.name,this.props.field_code, obj,e);
    }
    render(){
        return (
            <div>
                <label>Source</label><input type={"text"}  className="form-control" onChange={this.onRoutesTextChange.bind(this)}
                                             name={"source"} value={this.state.obj["source"]} /><br/>
                <label>Target</label><input type={"text"}  className="form-control" onChange={this.onRoutesTextChange.bind(this)}
                                               name={"target"} value={this.state.obj["target"]} /><br/>
                <button className={"btn btn-primary"} onClick={this._saveRoute.bind(this)}>Save</button>
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th /><th>Source</th><th>Target</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(this.props.value[this.props.name] || []).map((route,index)=>{
                        return (
                            <tr key={"child_route_" + index}>
                                <td><a className="nav-link" onClick={this._delete.bind(this, route, index)} ><TimesCircle/></a></td><td>{route.source}</td><td>{route.target}</td>
                            </tr>);
                    })}
                    </tbody>
                </table>

            </div>);
    }
}

export class ParamsCollectionDefine extends Component{
    constructor(props){
        super();
        console.log("param props", props);
        this.state = {relations:[], child_collection: props.value || {routes:[]},obj:{} };

    }
    async componentDidMount(){

    }
    _saveRoute(e){
        let obj = this.props.value;
        obj[this.props.name] = obj[this.props.name] || [];
        obj[this.props.name].push(this.state.obj);
        this.state.obj = {url_key: '',url_value:''};
        this.setState({obj:this.state.obj});
        if(this.props.onChange)
            this.props.onChange(this.props.name,this.props.field_code, obj,e);
    }
    onRoutesTextChange(e){
        this.state.obj[e.target.name] = e.target.value;
        this.setState({obj: this.state.obj});
    }
    _delete(item, index, e){
        let obj = this.props.value;
        obj[this.props.name].splice(index, 1);
        if(this.props.onChange)
            this.props.onChange(this.props.name,this.props.field_code, obj,e);
    }
    render(){
        return (
            <div>
                <label>Url Key</label><input type={"text"}  className="form-control" onChange={this.onRoutesTextChange.bind(this)}
                                             name={"url_key"} value={this.state.obj["url_key"]} /><br/>
                <label>Url Value</label><input type={"text"}  className="form-control" onChange={this.onRoutesTextChange.bind(this)}
                                              name={"url_value"} value={this.state.obj["url_value"]} /><br/>
                <button className={"btn btn-primary"} onClick={this._saveRoute.bind(this)}>Save</button>
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th /><th>Url Key</th><th>Url Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(this.props.value[this.props.name] || []).map((route,index)=>{
                        return (
                            <tr key={"child_route_" + index}>
                                <td><a className="nav-link" onClick={this._delete.bind(this, route, index)} ><TimesCircle/></a></td><td>{route.url_key}</td><td>{route.url_value}</td>
                            </tr>);
                    })}
                    </tbody>
                </table>

            </div>);
    }
}
let ParamDisplay = (param) =>{
    return (<table className={"table"}>
        <thead><tr><th>Key</th><th>Value</th></tr></thead>
        <tbody>{Object.keys(param.value).map((i,index) => {
            return (<tr><td>{i}</td><td>
                {param.value[i] instanceof Object && <ParamDisplay value={param.value[i]} />}
                {!(param.value[i] instanceof Object) && param.value[i]}
                </td></tr>);
        })}</tbody></table>);
};
export class IntegrationForm extends Component{
    constructor(){
        super();
        this.state = {obj:{},res:{}, in_test:false,auth_keys:[]};
        this.service_manager = ObjContainer.resolve("service_manager");

    }
    async componentDidMount(){
        let param_state = ObjContainer.resolve("nav").getState();
        let obj = {};
        console.log("param state", param_state);
        if(param_state.route_params && param_state.route_params.filter)
            obj = await this.service_manager.resolve("external_apis").getById(param_state.route_params);

        let auth_keys = await this.service_manager.resolve("external_apis").get({});
        console.log("auth keys",auth_keys.data.data);
        this.setState({obj, auth_keys:auth_keys.data.data || []});
    }
    onTextChange(name, field_code, data){
        this.setState({obj: data});
    }
    onChange(field_code, e){
        this.state.obj[field_code]  = e.target.value;
        this.setState(this.state);
    }
    onDDChange(obj, e){
        this.state.obj[e.target.name] = obj.value;
        this.setState(this.state);
    }
    async onSave(){
        await this.service_manager.resolve("external_apis").upsert(this.state.obj._id, this.state.obj);
        this.setState({obj:this.state.obj});
    }
    async test(){
        let external_api_request = new ExternalApiRequest();
        let res = await external_api_request.test(this.state.obj);
        this.setState({res: res.data,in_test:true});
    }
    render(){
        return (
            <div className={"container-fluid"}>
                <div className={"row"}>
                    <div className={"col-md-12"}>
                        <h2>API Integration</h2>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-md-2"}>
                        <label className={"control-label"}>API Global Key</label>
                    </div>
                    <div className={"col-md-10"}>
                        <input type={"text"} className={"form-control"} name={"global_key"} onChange={this.onChange.bind(this,"global_key")} value={this.state.obj["global_key"]}/>
                    </div>
                </div>
                <div className={"row"}  style={{marginTop: "10px"}}>
                    <div className={"col-md-2"}>
                        <label className={"control-label"}>API Url</label>
                    </div>
                    <div className={"col-md-10"}>
                        <input type={"text"} className={"form-control"} name={"url"} onChange={this.onChange.bind(this,"url")} value={this.state.obj["url"]}/>
                    </div>
                </div>
                <div className={"row"} style={{marginTop: "10px"}}>
                    <div className={"col-md-2"}>
                        <label className={"control-label"}>API Path</label>
                    </div>
                    <div className={"col-md-10"}>
                        <input type={"text"} className={"form-control"} name={"path"} onChange={this.onChange.bind(this,"path")} value={this.state.obj["path"]}/>
                    </div>
                </div>
                <div className={"row"} style={{marginTop: "10px"}}>
                    <div className={"col-md-2"}>
                        <label className={"control-label"}>Request Method</label>
                    </div>
                    <div className={"col-md-10"}>
                        <DropDownList value={{display: this.state.obj["request_type"]}}
                                      onChange={this.onDDChange.bind(this)}
                                      name={"request_type"}
                                      options={[{display:"get",value:"get"},{ display:"post", value: "post"},{display:"put",value:"put"},{display:"delete",value:"delete"}]} />
                    </div>
                </div>
                <div className={"row"} style={{marginTop: "10px"}}>
                    <div className={"col-md-2"}>
                        <label className={"control-label"}>Auth key Request</label>
                    </div>
                    <div className={"col-md-10"}>
                        <DropDownList value={{display: this.state.obj["auth_request_key"]}}
                                      onChange={this.onDDChange.bind(this)}
                                      name={"auth_request_key"}
                                      options={(this.state.auth_keys || []).map(auth=> {
                                          return { display: auth.global_key, value: auth.global_key};
                                      })} />
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-md-2"}>
                        <button className={"btn btn-primary"} onClick={this.onSave.bind(this)}>Save</button>&nbsp;<button className={"btn btn-primary"} onClick={this.test.bind(this)}>Test</button>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-md-2"}>
                        {this.state.in_test && <ParamDisplay value={this.state.res} />}
                    </div>
                </div>
                <br/>
                <ul className="nav nav-tabs">
                    <li className="nav-item active">
                        <a className="nav-link active" data-toggle="tab" href="#parameters" role="tab">Parameters</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#headers" role="tab">Headers</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#mapping" role="tab">Mapping</a>
                    </li>


                    <li className="nav-item">
                        <a className="nav-link"data-toggle="tab" href="#settings" role="tab">Settings</a>
                    </li>

                </ul>

                <div className={"tab-content"}>
                    <div className={"tab-pane active"} id={"parameters"} role={"tabpanel"}>
                        <div className={"row"}>
                            <div className={"col-md-12"}>
                                <h2>Parameters</h2>
                                <ParamsCollectionDefine value={this.state.obj} name={"params"} field_code={"params"} onChange={this.onTextChange.bind(this)} />
                            </div>
                        </div>
                    </div>
                    <div className={"tab-pane"} id={"headers"} role={"tabpanel"}>
                        <div className={"row"}>
                            <div className={"col-md-12"}>
                                <h2>Headers</h2>
                                <HeaderCollectionDefine value={this.state.obj} name={"headers"} field_code={"headers"} onChange={this.onTextChange.bind(this)} />
                            </div>
                        </div>
                    </div>
                    <div className={"tab-pane"} id={"mapping"} role={"tabpanel"}>
                        <div className={"row"}>
                            <div className={"col-md-12"}>
                                <h2>Mapping</h2>
                                <MappingCollectionDefine value={this.state.obj} name={"mapping"} field_code={"mapping"} onChange={this.onTextChange.bind(this)} />
                            </div>
                        </div>
                    </div>
                    <div className={"tab-pane"} id={"settings"} role={"tabpanel"}>
                        <div className={"row"}>
                            <div className={"col-md-12"}>
                                <h2>Settings</h2>

                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }
}