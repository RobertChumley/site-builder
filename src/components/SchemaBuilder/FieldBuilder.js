import React, { Component } from 'react';
import {ObjContainer} from "../../services/object_container";
import {TableMasterComponent} from "../TableDriver/TableMasterComponent";
import TimesCircle from 'react-icons/lib/fa/times-circle';

class PickListDefiner extends Component{

    constructor(params){
        super();
        this.state = {obj:{}, field: params.field, show:false,modal:null};
        this.service_manager = ObjContainer.resolve("service_manager");
    }
    async _delete(val, index){
        this.state.field.options.splice(index, 1);
        this.setState({obj:{display:"",value:""},field: this.state.field});
        await this.service_manager.resolve("fields").upsert(this.state.field._id,this.state.field);
        this.service_manager.resolve("fields").emit("field_update",this.state.field);
    }
    _appendItem(){
        this.state.field.options = this.state.field.options || [];
        this.state.field.options.push(this.state.obj);
        this.setState({obj:{"display":"","value":""},field: this.state.field});
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
                <div className={'modal-backdrop fade ' +  (this.state.show ?  "show" :"")}  role="presentation" />
            );
        }
        return null;
    };
    render(){
        return (
            <span>
                <a className="nav-link"  type="button" onClick={this._showModal.bind(this)}>
                    define
                </a>
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
                                        return (<tr key={"field_option_" + index}><td><a className="nav-link" onClick={this._delete.bind(this, option, index)} ><TimesCircle/></a></td><td>{option.display}</td><td>{option.value}</td></tr>);
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
let TextAreaInputField = (params) =>{
    return (<textarea type="text" className="form-control" name={params.field.field_code}  onChange={params.onChange.bind(this, params.field.field_code,null)} value={params.value}/>)
}
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

export class FieldBuilder extends Component{
    constructor(){
        super();
        this.state = {schema_def:{fields:[]},obj:{}, param_state: ObjContainer.resolve("nav").getState() };
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
        this.service_manager.resolve(this.props.config.table_name).addListener("update-filter",async (filter)=>{
            console.log("the filter all the way up",filter);
            let data = this.state.obj[this.state.schema_def.child_collection.table_name] || [];
            let sort = filter.sort;
            data.sort((i,j)=> {
                if(sort.sort_direction === "asc"){
                    if(i[sort.field_code] < j[sort.field_code])
                        return -1;
                    if(i[sort.field_code] > j[sort.field_code])
                        return 1;
                }else{
                    if(j[sort.field_code] < i[sort.field_code])
                        return -1;
                    if(j[sort.field_code] > i[sort.field_code])
                        return 1;
                }
                return 0;
            });
            this.state.obj[this.state.schema_def.child_collection.table_name] = data;
            this.setState({obj: this.state.obj});
        });
    }
    async performNavSetup(config){
        this.state.param_state = ObjContainer.resolve("nav").getState();
        this.data_def = await this.service_manager.resolve(config.table_name).schema({});
        let obj = {};
        if(this.state.param_state.route_params && this.state.param_state.route_params.filter){
            if(this.data_def.data.child_collection){
                this.state.param_state.route_params["expand"] = [this.data_def.data.child_collection.table_name]
            }
            obj = await this.service_manager.resolve(config.table_name).getById(this.state.param_state.route_params);
        }
        obj = Object.assign({},obj,this.state.param_state.parent_data || {});
        this.setState({schema_def: this.data_def.data,obj:obj,param_state: this.state.param_state});
    }
    componentWillUnmount(){
        this.service_manager.removeAllListeners("form_setup");
    }
    _onChange(vals,value, e){
        this.state.obj[vals] = value || e.target.value;
        this.setState({obj:this.state.obj});
    }
    _onDefine(){

    }
    async _onSave(){
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
    _childify(){
        return Object.assign({},this.state.schema_def.child_collection);
    }
    render(){
        return (
            <div>
                <h2>{this.props.config.title}</h2>
                <FormDefinition definition={this.state.schema_def} obj={this.state.obj} ops={{onSave: this._onSave.bind(this),
                    onChange: this._onChange.bind(this),onCancel: this._onCancel.bind(this),onDefine:this._onDefine.bind(this) }}/>
                {(this.state.schema_def.child_collection && this.state.param_state && this.state.param_state.route_params)
                && <TableMasterComponent rows={this.state.obj[this.state.schema_def.child_collection.table_name] || []}
                                         config={this._childify()}
                                         parent_data={{parent_collection: this.state.schema_def.table_name,parent_id: this.state.param_state.route_params.filter._id }}/>}
            </div>);
    }
}