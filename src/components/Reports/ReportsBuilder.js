import React, { Component } from 'react';
import {ObjContainer} from "../../services/object_container";
import reportTest from './reportTest'
import 'd3'



class PickListDefiner extends Component{
    constructor(params){
        super();
        this.state = {obj:{},  show:false,modal:null};
        this.service_manager = ObjContainer.resolve("service_manager");
    }

    _onChange(obj){
        if(this.props.onChange)
            this.props.onChange(obj);
    }
    async _saveOptions(){
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
                                <div className="modal-title" id="exampleModalLabel">Define Report Params
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this._closeModal.bind(this)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <label>Label Field</label> <input type="text" onChange={this._onChange.bind(this) } name={"label_field"} value={this.props.obj["label_field"]}/>&nbsp;
                                    <label>Numeric Field</label> <input type={"text"} name={"numeric_field"} onChange={this._onChange.bind(this) } value={this.props.obj["numeric_field"]}/>
                                </div>


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


let DropDownList = (params)=>{
    return (
        <span className="dropdown" style={{width:"100%"}}>
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"  >
                {params.value.display || "Selct One..."}
                &nbsp;<span className="caret" style={{textAlign:"right"}}/>
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
let CheckboxField = (params) => {
    let _onChange = (val,e) =>{
        if(e.target.checked){
            params.onChange(params.name, true,e);
        }else{
            params.onChange(params.name, null,e);
        }
    };
    return (
        <input type={"checkbox"} name={params.name} onChange={_onChange.bind(this,params.name)} checked={params.value} />
    );
};
export class ReportsBuilder extends Component{
    constructor(){
        super();
        this.state = {controls:{height:500,width:500},tables:[]};
        this.service_manager = ObjContainer.resolve("service_manager");
    }
    async componentDidMount(){
        let tables_data = await this.service_manager.resolve("tables").get({});
        let param_state = ObjContainer.resolve("nav").getState();
        let obj = {};
        if(param_state.route_params && param_state.route_params.filter)
            obj = await this.service_manager.resolve("reports").getById(param_state.route_params);

        this.setState({tables:tables_data.data.data,controls:Object.assign({height:500,width:500},obj)});
    }
    onTextChange(e){
        this.state.controls[e.target.name]= e.target.value;
        this.setState(this.state);

    }
    async _refresh(e){
        let tables_data = [];
        if(this.state.controls["source_table"]){
            tables_data = await this.service_manager.resolve(this.state.controls["source_table"]).get({});
            switch(this.state.controls.report_type || "pie"){
                case "pie":
                    reportTest.render(Object.assign({},this.state.controls,{data:tables_data.data.data}));
                    break;
                case "histogram":
                    reportTest.renderHistogram(Object.assign({},this.state.controls,{data:tables_data.data.data}));
                    break;
                case "scatterwithregression":
                    reportTest.renderScatterWithRegression(Object.assign({},this.state.controls,{data:tables_data.data.data}));
                    break;
                default:
                    reportTest.render(Object.assign({},this.state.controls,{data:tables_data.data.data}));
            }

        }

    }
    _paramDefineChange(e){
        this.state.controls.params =this.state.controls.params || {};
        this.state.controls.params[e.target.name] = e.target.value;
        this.setState(this.state);
    }
    onDDChange(obj, e){
        this.state.controls[e.target.name] = obj.value;
        this.setState(this.state);
    }
    onCBChange(name, value, e){
        this.state.controls[name] =value;
        this.setState(this.state);
    }
    async _save(){
        await this.service_manager.resolve("reports").upsert(this.state.controls._id,this.state.controls);
    }
    render(){
        return <div>
            <h1>Reports Builder</h1>
            <div className={"row"}>
                <div className={"col-md-3"}>Name</div>
                <div className={"col-md-3"}><input className="form-control" onChange={this.onTextChange.bind(this)} type={"text"} name={"report_name"} value={this.state.controls["report_name"]}/></div>
            </div>
            <div className={"row"}>
                <div className={"col-md-3"}>Height</div>
                <div className={"col-md-3"}><input className="form-control" onChange={this.onTextChange.bind(this)} type={"text"} name={"height"} value={this.state.controls["height"]}/></div>
            </div>
            <div className={"row"}>
                <div className={"col-md-3"}>Width</div>
                <div className={"col-md-3"}><input className="form-control" onChange={this.onTextChange.bind(this)} type={"text"} name={"width"} value={this.state.controls["width"]}/></div>
            </div>
            <div className={"row"}>
                <div className={"col-md-3"}>Table</div>
                <div className={"col-md-3"}><DropDownList value={{display: this.state.controls["source_table"]}}
                                                          onChange={this.onDDChange.bind(this)}
                                                          name={"source_table"}
                                                          options={this.state.tables.map(i => {return {display:i.table_name, value:i.table_name};} )}/></div>
            </div>
            <div className={"row"}>
                <div className={"col-md-3"}>Report Type</div>
                <div className={"col-md-3"}><DropDownList value={{display: this.state.controls["report_type"]}}
                                                          onChange={this.onDDChange.bind(this)}
                                                          name={"report_type"}
                                                          options={[{display:"pie",value:"pie"},{display:"histogram",value:"histogram"},{display:"Scatter with Regression",value:"scatterwithregression"}]}/> &nbsp;
                    <PickListDefiner obj={this.state.controls["params"] || {}} onChange={this._paramDefineChange.bind(this)}/>
                </div>
            </div>
            <div className={"row"}>
                <div className={"col-md-3"}>On Dashboard</div>
                <div className={"col-md-3"}><CheckboxField value={ this.state.controls["on_dashboard"]}
                                                          onChange={this.onCBChange.bind(this)}
                                                          name={"on_dashboard"} /></div>
            </div>
            <div  className={"row"}>
                <div className={"col-md-3"}>
                    <button className={"btn btn-primary"} onClick={this._save.bind(this)}>Save</button>&nbsp;<button className={"btn btn-primary"} onClick={this._refresh.bind(this)}>Refresh</button>
                </div>
            </div>
            <div className={"equation"}/>
            <div className={"equation"}/>
            <div className={"report"} />
        </div>
    }
}