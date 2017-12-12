import React, { Component } from 'react';
import {ObjContainer} from "../../services/object_container";
import {TableMasterComponent} from "../TableDriver/TableMasterComponent";
import TimesCircle from 'react-icons/lib/fa/times-circle';
import FaSearch from 'react-icons/lib/fa/search';
import FaEye from 'react-icons/lib/fa/eye';
import moment from 'moment';
class ReferenceSelector extends Component{
    constructor(params){
        super();
        this.state = {show:false,value:params.value,display: (params.value || {}).display} ;
    }
    _showModal(){
        this.setState({show:true});
    }
    _closeModal(){
        this.setState({show:false});
    }
    _save(){
    }
    _onRowClick(field, row){

        let val = row[this.props.field.reference.field_code || "_id"];
        if(val instanceof Object) {
            row.display = row[this.props.field.reference.field_code || "_id"].display;
        }else{
            row.display = row[this.props.field.reference.field_code || "_id"];
        }
        this.setState({value: row,display: row.display, show:false});
        if(this.props.onChange)
            this.props.onChange(this.props.field.field_code, row, row);
    }
    renderBackdrop = () => {
        if (this.state.show ) {
            return (
                <div
                    className={'modal-backdrop fade ' +  (this.state.show ?  "show" :"")}
                    role="presentation"
                />
            );
        }
        return null;
    };
    render(){
        return (
            <span>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder={this.props.field.field_name} value={this.state.display} aria-describedby="sizing-addon2" />
                    <span className="input-group-addon" id="sizing-addon2"><a className="nav-link"  onClick={this._showModal.bind(this)}><FaSearch /></a></span>
                </div>

                <div className={'modal ' + (this.state.show ? "show" : "")}
                     id="myModal"
                     style={{ display: ((this.state.show) ? 'block' : 'none') }}
                     tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                     aria-hidden={!this.state.show}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="modal-title" id="exampleModalLabel">Lookup
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this._closeModal.bind(this)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>
                            <div className="modal-body">
                                <TableMasterComponent rowClick={this._onRowClick.bind(this)} config={{fields:[],table_name:this.props.field.reference.relation_table} } definition={{fields:[]}}/>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this._closeModal.bind(this)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={this._save.bind(this)}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderBackdrop()}
            </span>);
    }
}
class PickListDefiner extends Component{
    constructor(params){
        super();
        this.state = {obj:{}, field: params.field, show:false,modal:null};
        this.service_manager = ObjContainer.resolve("service_manager");
    }
    async _delete(val, index){
        this.state.field.options.splice(index, 1);
        this.setState({obj:{display:"",value:"",dropin:""},field: this.state.field});
        await this.service_manager.resolve("fields").upsert(this.state.field._id,this.state.field);
        this.service_manager.resolve("fields").emit("field_update",this.state.field);
    }
    _appendItem(){
        this.state.field.options = this.state.field.options || [];
        this.state.field.options.push(this.state.obj);
        this.setState({obj:{"display":"","value":"",dropin:null},field: this.state.field});
    }
    _onChange(obj){
        this.state.obj[obj.target.name] = obj.target.value;
        this.setState({obj:this.state.obj});
    }
    async _saveOptions(){
        await this.service_manager.resolve("fields").upsert(this.state.field._id,this.state.field);
        this.service_manager.resolve("fields").emit("field_update",this.state.field);
        this.setState({show:false});
    }
    _showModal(){
        this.setState({show:true});
    }
    _closeModal(){
        this.setState({show:false});
    }
    renderBackdrop = () => {
        if (this.state.show ) {
            return (
                <div className={'modal-backdrop fade ' +  (this.state.show ?  "show" :"")} role="presentation" />
            );
        }
        return null;
    };
    render(){
        return (
            <span>
                <a className="nav-link"  type="button" onClick={this._showModal.bind(this)}>define</a>
                <div className={'modal ' + (this.state.show ? "show" : "")}
                     id="myModal"
                     style={{ display: ((this.state.show) ? 'block' : 'none') }}
                     tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                     aria-hidden={!this.state.show}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="modal-title" id="exampleModalLabel">Define {this.state.field.field_name}
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this._closeModal.bind(this)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <label>Option Text</label> <input type="text" onChange={this._onChange.bind(this) } name={"display"} value={this.state.obj["display"]}/>&nbsp;
                                    <label>Option Value</label> <input type={"text"} name={"value"} onChange={this._onChange.bind(this) } value={this.state.obj["value"]}/>
                                </div>
                                <div>
                                    <button className={"btn btn-primary"} onClick={this._appendItem.bind(this)}>Add</button>
                                </div>
                                <table className="table table-responsive">
                                    <thead>
                                        <tr><th/><th>Option Text</th><th>Option Value</th></tr>
                                    </thead>
                                    <tbody>
                                    {(this.state.field.options || []).map((option, index)=>{
                                        return (<tr key={"field_option_" + index}>
                                            <td><a className="nav-link" onClick={this._delete.bind(this, option, index)} ><TimesCircle/></a></td><td>{option.display}</td><td>{option.value}</td></tr>);
                                    })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this._closeModal.bind(this)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={this._saveOptions.bind(this)}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderBackdrop()}
            </span>);
    }
}

let BlockLabel = (params) =>{
    return (
        <div style={{float:"left",width:"150px",marginTop: "10px"}}><label className="form-label">{params.field.field_name}:</label></div>
    );
};
let TextInputField = (params)=>{
  return (<input type="text" className="form-control" name={params.field.field_code} value={params.value} onChange={params.onChange.bind(this, params.field.field_code,null)}/>)
};
let PasswordInputField = (params)=>{
    return (<input type="password" className="form-control" name={params.field.field_code} value={params.value} onChange={params.onChange.bind(this, params.field.field_code,null)}/>)
};
let TextAreaInputField = (params) =>{
    return (<textarea type="text" className="form-control" name={params.field.field_code}  onChange={params.onChange.bind(this, params.field.field_code,null)} value={params.value}/>)
};
let DropDownFieldSelector = (params)=>{

    return (
        <span className="dropdown">
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                {params.value.display || "Selct One..."}
                &nbsp;<span className="caret"/>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                {(params.field.options || []).map((option,index) =>{
                    return <li key={"option_value_" + index}><a className="nav-link" onClick={params.onChange.bind(this,params.field.field_code,option)} >{option.display}</a></li>;
                })}
            </ul>
            &nbsp;<PickListDefiner field={params.field} />
        </span>
    )
};
let CheckboxField = (params) => {
    let _onChange = (val,e) =>{

        if(e.target.checked){
            params.onChange(params.field.field_code, {value: params.field.field_code});
        }else{
            params.onChange(params.field.field_code, {value: null},e);
        }
    };
    console.log("Checkbox params", params.value);
    return (
        <input type={"checkbox"} name={params.field.field_code} onChange={_onChange.bind(this, params.field.field_code)} checked={params.value && params.value.value !== null && params.value.value !== ''} />
    );
};
let FormInput = (params) =>{
    let datatype = params.field.data_type;
    if(datatype instanceof Object)
        datatype= datatype.value;
    switch (datatype){
        case "string":
            return (<TextInputField field={params.field} value={params.value} onChange={params.onChange}/>);
        case "pick_list":
            return (<DropDownFieldSelector field={params.field} value={params.value} onChange={params.onChange} onDefine={params.onDefine}/>);
        case "text":
            return (<TextAreaInputField field={params.field} value={params.value} onChange={params.onChange}/>);
        case "checkbox":
            return (<CheckboxField field={params.field} value={params.value} onChange={params.onChange}/>);
        case "reference":
            return (<ReferenceSelector field={params.field} value={params.value} onChange={params.onChange}/>);
        case "password":
            return (<PasswordInputField field={params.field} value={params.value} onChange={params.onChange}/>);
        default:
            return (<TextInputField field={params.field} value={params.value} onChange={params.onChange}/>);
    }
};
let BlockTextInput = (params) =>{
  return (
      <div  style={{float:"left",width:"250px",marginTop: "5px"}}>
          <FormInput field={params.field} value={params.value} onChange={params.ops.onChange} onDefine={params.ops.onDefine} />
      </div>
  );
};
let BlockColumn = (params) =>{
    return <div className="form-column">
        <BlockLabel field={params.field}/><BlockTextInput field={params.field} ops={params.ops} value={params.value}/>
        <FormClear/>
    </div>;
};
let ButtonGroup = (params) =>{
  return <div><button className="btn btn-primary" onClick={params.ops.onSave}>Save</button>&nbsp;<button onClick={params.ops.onCancel}  className="btn btn-primary">Cancel</button></div>
};
let FormClear = () =>{
    return <div className="clearfix"/>
};
let FormDefinition = (params) =>{
  return (
      <div>
          <br/>
          {(params.definition.fields || []).map((field, index)=>{
              return <BlockColumn key={"column-field-key-" + index} field={field} ops={params.ops} value={params.obj[field.field_code] || ''}/>
          })}
          <FormClear />
          <ButtonGroup ops={params.ops}/>
      </div>);
};

let Popup = (content)=>{
    let renderBackdrop = () => {
        if (content.show ) {
            return (
                <div
                    className={'modal-backdrop fade ' +  (content.show ?  "show" :"")}
                    role="presentation"
                />
            );
        }
        return null;
    };
    return (
        <span>
            <div className={'modal ' + (content.show ? "show" : "")}
                 id="myModal"
                 style={{ display: ((content.show) ? 'block' : 'none') }}
                 tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                 aria-hidden={!content.show}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title" id="exampleModalLabel">{content.title}
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={content.closeModal.bind(this)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                        <div className="modal-body">
                            {content.children}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={content.closeModal.bind(this)}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={content.save.bind(this)}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            {renderBackdrop()}
        </span>);
};
class SettingsArea extends Component{
    constructor(){
        super();
        this.state = {show:false,history:[],vis_items:{}};
        this.service_manager = ObjContainer.resolve("service_manager");
    }
    async _showModal(){
        let tables_data = await this.service_manager.resolve(this.props.table_name).history(this.props._id);
        this.setState({history:tables_data.data,show:true});
    }
    _closeModal(){
        this.setState({show:false});
    }
    _save(){
        this.setState({show:true});
    }
    showDetails(index, e){
        this.state.vis_items["show_history"+index] = !this.state.vis_items["show_history"+index];
        this.setState({vis_items:this.state.vis_items});
    }
    render(){
        //{ op: 'replace', path: '/iata_code', value: 'LAX' }
        return (<div>
            <h1>Settings</h1>
            <div>
                <a className={"nav-link"} onClick={this._showModal.bind(this)}>History</a>
                <Popup title={"History"} closeModal={this._closeModal.bind(this)} save={this._save.bind(this)} show={this.state.show}>
                    <table className={"table"}><thead><tr><th>Date</th><th>Change</th></tr></thead>
                        <tbody>
                            {((this.state.history || {ops:[]}).ops || []).map((item, index)=>{
                                return (<tr key={"history_item_row_" + index}><td>{moment(item.op_on).format('MMMM Do YYYY, h:mm:ss a')}</td><td>{item.operation}</td><td>
                                    <a className={"nav-link"} onMouseEnter={this.showDetails.bind(this,index)} ><FaEye /></a>
                                    <div style={{display:this.state.vis_items["show_history"+index] ? "block" : "none",position:"absolute"}}>
                                        <div style={{border: "1px solid silver", borderRadius:"5px", padding: "5px",backgroundColor: "white",width:"200px"}}>
                                            <h4>List of Changes</h4>
                                            {item.changes.map((change, c_index)=>{
                                                return (
                                                    <div>
                                                        <span style={{fontWeight:"bold"}}>{change.op}:</span><span>{change.path}</span> -> <span>
                                                        {change.value instanceof Object ? (change.value.display || JSON.stringify(change.value)) : change.value}</span>

                                                    </div>
                                                )
                                            })}

                                    </div></div>
                                </td></tr>)
                            })}
                        </tbody></table>
                </Popup>
            </div>
        </div>);
    }
}
let SetupTabs = (params) =>{

    let first_1 = true;
    let first_2 = true;
    return (<div style={{marginTop: "10px"}}>
        <ul className="nav nav-tabs" role="tablist">
            {params.tab_def.map((tab,index)=>{
                let ret =(
                    <li className={"nav-item " + (first_1 ? "active": "" )} key={"tab-def-" + index}>
                        <a className={"nav-link " + (first_1 ? "active": "" )} data-toggle="tab" href={"#" + tab.name} role="tab">{tab.title}</a>
                    </li>);
                first_1 = false;
                return ret;
            })}
            <li  className={"nav-item " + (first_1 ? "active": "" )}>
                <a className={"nav-item " + (first_1 ? "active": "" )} data-toggle="tab" href="#settings" role="tab">Settings</a>
            </li>
        </ul>
        <div className="tab-content">
            {params.tab_def.map((tab,index)=>{
                let ret =(<div className={"tab-pane " + (first_2 ? "active": "" )} id={tab.name} role="tabpanel" key={"tab-act-" + index}>{tab.content}</div>);
                first_2 = false;
                return ret;
            })}
            <div className={"tab-pane " + (first_2 ? "active": "" )} id="settings" role="tabpanel"><SettingsArea _id={params._id} table_name={params.table_name} /></div>
        </div>


    </div>);
};
let DropDownList = (params)=>{
    return (
        <span className="dropdown">
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                {params.value.display || "Selct One..."}
                &nbsp;<span className="caret"/>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                {(params.options|| []).map((option,index) =>{
                    return <li key={"relation_option_value_" + index}>
                        <a className="nav-link" onClick={params.onChange.bind(this,option)} name={params.name} >{option.display}</a>
                    </li>;
                })}
            </ul>
        </span>
    )
};


export class ChildCollectionDefine extends Component{
    constructor(props){
        super();
        this.state = {relations:[], child_collection: props.value || {routes:[]},obj:{} };
        this.service_manager = ObjContainer.resolve("service_manager");
    }
    async componentDidMount(){
        let tables_data = await this.service_manager.resolve("tables").get({});
        this.setState({relations:tables_data.data.data});
    }
    onChange(option,e){
        this.state.child_collection[e.target.name] = option.value;
        this.setState({child_collection: this.state.child_collection});
        if(this.props.onChange)
            this.props.onChange(this.props.name,this.props.field_code, this.state.child_collection,e);
    }
    onTextChange(e){
        this.state.child_collection[e.target.name] = e.target.value;
        this.setState({child_collection: this.state.child_collection});
        if(this.props.onChange)
            this.props.onChange(this.props.name,this.props.field_code, this.state.child_collection,e);
    }
    _saveRoute(e){
        this.state.child_collection.routes = this.state.child_collection.routes || [];
        this.state.child_collection.routes.push(this.state.obj);
        this.setState({obj:{route_key:'',route_dest:''},child_collection: this.state.child_collection});
        if(this.props.onChange)
            this.props.onChange(this.props.name,this.props.field_code, this.state.child_collection,e);
    }
    onRoutesTextChange(e){
        this.state.obj[e.target.name] = e.target.value;
        this.setState({obj: this.state.obj});
    }
    _delete(item, index, e){
        this.state.child_collection.routes.splice(index, 1);
        this.setState({child_collection: this.state.child_collection});
        if(this.props.onChange)
            this.props.onChange(this.props.name,this.props.field_code, this.state.child_collection,e);
    }
    render(){
        return (<div>
            <h1>Child Define</h1>
            <div className={"row"} style={{marginTop: "10px"}}>

                <div className="col-md-3">
                    <label>Child Table:</label>
                </div>
                <div className={"col-md-3"}>
                    <DropDownList value={{display: this.state.child_collection["table_name"],value:this.state.child_collection["table_name"]}}
                                  onChange={this.onChange.bind(this)}
                                  name={"table_name"}
                                  options={this.state.relations.map(relation => {
                                      return { display: relation.table_name, value: relation.table_name};
                                  })} />
                </div>
            </div>
            <div className={"row"}  style={{marginTop: "5px"}}>
                <div className={"col-md-3"}><label>Title:</label></div>
                <div className={"col-md-3"}><input type={"text"}  className="form-control" onChange={this.onTextChange.bind(this)}
                                                   name={"title"} value={this.state.child_collection["title"]}/></div>
            </div>
            <div className={"row"}  style={{marginTop: "5px"}}>
                <div className={"col-md-3"}><label>Routes Define</label></div>
                <div className={"col-md-5"}>
                    <label>Route Key</label><input type={"text"}  className="form-control" onChange={this.onRoutesTextChange.bind(this)}
                           name={"route_key"} value={this.state.obj["route_key"]} />
                    <label>Route Dest</label><input type={"text"}  className="form-control" onChange={this.onRoutesTextChange.bind(this)}
                           name={"route_dest"} value={this.state.obj["route_dest"]} /><br/>
                    <button className={"btn btn-primary"} onClick={this._saveRoute.bind(this)}>Save</button>
                    <table className={"table"}>
                        <thead>
                            <tr>
                                <th /><th>Route Key</th><th>Route Dest</th>
                            </tr>
                        </thead>
                        <tbody>
                        {(this.state.child_collection.routes || []).map((route,index)=>{
                            return (
                                <tr key={"child_route_" + index}>
                                    <td><a className="nav-link" onClick={this._delete.bind(this, route, index)} ><TimesCircle/></a></td><td>{route.route_key}</td><td>{route.route_dest}</td>
                                </tr>);
                        })}
                        </tbody>
                    </table>
                   </div>
            </div>
        </div>);
    }
}


export class ReferenceDefine extends Component{
    constructor(props){
        super();
        this.state = {relations:[], reference_relation: props.value || {} };
        this.service_manager = ObjContainer.resolve("service_manager");
    }
    async componentDidMount(){
        let tables_data = await this.service_manager.resolve("tables").get({});
        this.setState({relations:tables_data.data.data});
    }
    onChange(option,e){
        this.state.reference_relation[e.target.name] = option.value;
        this.setState({reference_relation: this.state.reference_relation});
        if(this.props.onChange)
            this.props.onChange(this.props.name,this.props.field_code, this.state.reference_relation,e);
    }
    onTextChange(e){
        this.state.reference_relation[e.target.name] = e.target.value;
        this.setState({reference_relation: this.state.reference_relation});
        if(this.props.onChange)
            this.props.onChange(this.props.name,this.props.field_code, this.state.reference_relation,e);
    }
    render() {
        return (<div>
            <div className={"row"} style={{marginTop: "10px"}}>

                <div className="col-md-3">
                    <label>Relation:</label>
                </div>
                <div className={"col-md-3"}>
                    <DropDownList value={{display: this.state.reference_relation["relation_table"]}}
                                  onChange={this.onChange.bind(this)}
                                  name={"relation_table"}
                                  options={this.state.relations.map(relation => {
                                        return { display: relation.table_name, value: relation.table_name};
                                    })} /></div>
            </div>
            <div className={"row"}  style={{marginTop: "5px"}}>
                <div className={"col-md-3"}><label>Relation Filter</label></div>
                <div className={"col-md-3"}><input type={"text"}  className="form-control" onChange={this.onTextChange.bind(this)}
                                                   name={"relation_filter"} value={this.state.reference_relation["relation_filter"]}/></div>
            </div>
            <div className={"row"}  style={{marginTop: "5px"}}>
                <div className={"col-md-3"}><label>Display Field Code</label></div>
                <div className={"col-md-3"}><input type={"text"}  className="form-control" onChange={this.onTextChange.bind(this)}
                                                   name={"field_code"} value={this.state.reference_relation["field_code"]}/></div>
            </div>
        </div>);
    }
}
const g_dropins = {
    "reference": {title:"Reference" ,name:"reference" ,contentObj: ReferenceDefine},
    "child":     {title:"Child" ,name:"child_collection" ,contentObj: ChildCollectionDefine}
};
export class FormMasterComponent extends Component{
    constructor(){
        super();
        this.state = {schema_def:{fields:[]},obj:{}, param_state: ObjContainer.resolve("nav").getState(),dropins:[] };
        this.service_manager = ObjContainer.resolve("service_manager");
    }
    async componentDidMount(){
        await this.performNavSetup(this.props.config);
        this.service_manager.addListener("form_setup",async (config)=>{
            await this.performNavSetup(config);
        });
        this.service_manager.resolve("fields").addListener("field_update",(field)=>{
            let field_index = this.state.schema_def.fields.indexOf(field);
            if(field_index > -1){
                this.state.schema_def.fields[field_index] = field;
                this.setState({schema_def: this.state.schema_def});
            }
        });
    }
    async performNavSetup(config){
        let param_state = ObjContainer.resolve("nav").getState();
        this.data_def = await this.service_manager.resolve(config.table_name).schema({});
        let obj = {};
        if(param_state.route_params && param_state.route_params.filter){
            obj = await this.service_manager.resolve(config.table_name).getById(param_state.route_params);
        }
        obj = Object.assign({},obj,this.state.param_state.parent_data || {});
        let dropins = [];
        (this.data_def.data.fields || []).forEach((field)=>{
            if((field.data_type === 'pick_list' || field.data_type ==='checkbox') && obj[field.field_code] && g_dropins[obj[field.field_code].value]){
                let dropin = g_dropins[obj[field.field_code].value];
                let dropinBase = Object.assign({},dropin , {content:
                    React.createElement(dropin.contentObj,Object.assign({},dropin,{onChange:this._changeChild.bind(this), field_code: field.field_code, value:obj[dropin.name]}),null)
                });
                dropins.push(dropinBase);
            }
        });
        this.setState({schema_def: this.data_def.data,obj:obj,param_state: param_state, dropins:dropins});
    }
    _changeChild(dropin_name, field_code, value){
        this.state.obj[dropin_name] = value;
        let dropins = [];
        let dropin = g_dropins[this.state.obj[field_code].value];
        let dropinBase = Object.assign({},dropin , {content:
            React.createElement(dropin.contentObj,Object.assign({},dropin,
                {onChange:this._changeChild.bind(this), field_code:field_code,value: this.state.obj[dropin.name]}),null)
        });
        dropins.push(dropinBase);
        this.setState({obj: this.state.obj,dropins:dropins});
    }
    componentWillUnmount(){
        this.service_manager.removeAllListeners("form_setup");
        this.service_manager.resolve(this.props.config.table_name).removeAllListeners("refresh-data");
        this.service_manager.resolve(this.props.config.table_name).removeAllListeners("update-filter");
        this.service_manager.resolve("fields").removeAllListeners("field_update")
    }
    _onChange(field_code,value, e){
        let old_obj = this.state.obj;
        this.state.obj[field_code] = value || e.target.value;
        let dropins = [];

        (this.state.schema_def.fields || []).forEach((field)=>{
            if((field.data_type === 'pick_list' || field.data_type ==='checkbox') && this.state.obj[field.field_code] && this.state.obj[field.field_code].value && g_dropins[this.state.obj[field.field_code].value]) {
                let dropin = g_dropins[this.state.obj[field.field_code].value];
                let dropinBase = Object.assign({},dropin , {content:
                    React.createElement(dropin.contentObj,Object.assign({},dropin,{onChange:this._changeChild.bind(this), field_code: field.field_code, value:this.state.obj[dropin.name]}),null)
                });
                dropins.push(dropinBase);
            }else if((field.data_type === 'pick_list' || field.data_type ==='checkbox')  && old_obj[field.field_code] && g_dropins[old_obj[field.field_code].value]){
                let dropin = g_dropins[old_obj[field.field_code].value];
                delete this.state.obj[dropin.name];
            }
        });
        this.setState({obj:this.state.obj,dropins});
    }
    _onDefine(){
    }
    async _onSave(){
        if(this.props.config.display_field)
            this.state.obj["display"] = this.state.obj[this.props.config.display_field];

        await this.service_manager.resolve(this.props.config.table_name).upsert(this.state.obj._id,this.state.obj);
        if(this.state.param_state.parent_data){
            ObjContainer.resolve("nav").navTo(this.state.param_state.parent_data.back_state.path, this.state.param_state.parent_data.back_state);
        }else{
            ObjContainer.resolve("nav").navTo(this.props.config.routes.find(route => route.route_key ==="list").route_dest);
        }
    }
    _onCancel(){
        if(this.state.param_state.parent_data){
            ObjContainer.resolve("nav").navTo(this.state.param_state.parent_data.back_state.path, this.state.param_state.parent_data.back_state);
        }else{
            ObjContainer.resolve("nav").navTo(this.props.config.routes.find(route => route.route_key ==="list").route_dest);
        }
    }
    _onDataChange(option, e){
    }
    render(){
        let tab_def = [];
        if(this.state.schema_def.child_collection && this.state.param_state && this.state.param_state.route_params){
            tab_def.push({
                name: this.state.schema_def.child_collection.table_name,
                title: this.state.schema_def.child_collection.table_name,
                content: (<TableMasterComponent config={this.state.schema_def.child_collection}
                                                parent_data={{
                                                    parent_collection: this.state.schema_def.table_name,
                                                    parent_id: this.state.param_state.route_params.filter._id }} />)});
        }
        tab_def = tab_def.concat(this.state.dropins);
        return (
            <div>
                <h2>{this.props.config.title}</h2>
                <FormDefinition definition={this.state.schema_def} obj={this.state.obj} ops={{onSave: this._onSave.bind(this),
                    onChange: this._onChange.bind(this), onCancel: this._onCancel.bind(this),onDefine:this._onDefine.bind(this) }}/>
                {this.state.obj._id &&
                    <SetupTabs tab_def={tab_def} onChange={this._onDataChange.bind(this)} table_name={this.state.schema_def.table_name} _id={this.state.obj._id}/>
                }
            </div>);
    }
}