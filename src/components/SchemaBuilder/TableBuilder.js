import React, { Component } from 'react';
import {ObjContainer} from "../../services/object_container";
import TimesCircle from 'react-icons/lib/fa/times-circle';
import DeHaze from 'react-icons/lib/md/dehaze';
import ReactFileReader from 'react-file-reader';


let Pager = (params) =>{
    let page_array = [];
    for(let i = 0;i < Math.ceil(params.paging.count / params.paging.page_size);i++){
        page_array.push(i + 1);
    }
    let nav_page = (page_params)=>{
        params.onPage(page_params);
    };
    return (
        <nav aria-label="Page navigation">
            <ul className="pagination">
                <li>
                    <a className={"nav-link"}  aria-label="Previous" onClick={nav_page.bind(this, params.paging.page - 1 )}>
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                {page_array.map((page, index) =>{
                    return <li key={"page_index_" + index}><a className={"nav-link"}  onClick={nav_page.bind(this, page )}>{page}</a></li>;
                })}
                <li>
                    <a className={"nav-link"}  aria-label="Next"  onClick={nav_page.bind(this, params.paging.page + 1 )}>
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    )
};
let DropDownFieldSelector = (params)=>{
    return (
        <span className="dropdown">
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                Table Actions <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                <li><a onClick={params.ops.onImport.bind(this)}>Import</a></li>
                <li><a>Delete All</a></li>
                <li><a>Reports</a></li>
                <li><a>Saved Queries</a></li>
                <li><a>Query Builder</a></li>
            </ul>
        </span>
    )
};
class TableFeatures extends Component{
    constructor(props){
        super();
        this.service_manager = ObjContainer.resolve("service_manager");
        this.state={showImport: false,definition: props.definition};
    }
    _onImport(){
        this.setState({showImport: true})
    }
    handleFiles(files){
        let reader = new FileReader();
        reader.onload = async (e) =>{
            await this.service_manager.resolve(this.state.definition.table_name).upload(reader.result);
            this.service_manager.resolve(this.state.definition.table_name).emit("update-grid");
        };
        reader.readAsText(files[0]);
    };
    render(){
        return (
            <div style={{float:"right"}}>
                <DropDownFieldSelector ops={{onImport: this._onImport.bind(this)}} />
                <div style={{display:(this.state.showImport ? "block" : "none")}}>
                    <ReactFileReader handleFiles={this.handleFiles.bind(this)}>
                        <button className='btn btn-primary'>Import</button>
                    </ReactFileReader>
                </div>
            </div>);
    }
}
let PopDownMenu = (props) => {
    let updateSort = (attr)=>{
        props.updateSort(attr);
    };
    return (
        <div style={{position: "absolute", marginLeft: "-8px",marginTop: "9px",zIndex:"1000", float: "left", width: "200px", height:"300px",backgroundColor: "white",border: "1px solid #DDD", display:(props.show ? "block":"none")}}>
            <div><input className={"form-control"} type={"text"} /></div>
            <div><a className={"nav-link"} onClick={updateSort.bind(this, {sort: {field_code: props.field.field_code, sort_direction:"desc"}})} >Sort Descending</a></div>
            <div><a className={"nav-link"} onClick={updateSort.bind(this, {sort: {field_code: props.field.field_code, sort_direction:"asc" }})}>Sort Ascending</a></div>
        </div>);
};
class TableHeaderMenu extends Component{
    constructor(){
        super();
        this.state = {show:false};
        this.service_manager = ObjContainer.resolve("service_manager");
    }
    _showMenu(){
        this.setState({show:!this.state.show});
    }
    _handleSort(sort_param){
        this.service_manager.resolve(this.props.definition.table_name).emit("filter-updated",sort_param);
        this.setState({show:false});
    }
    render(){
        return (
            <span>
                <a className={"nav-link"} onClick={this._showMenu.bind(this)}><DeHaze /></a>
                <PopDownMenu show={this.state.show} updateSort={this._handleSort.bind(this)} field={this.props.field}/>
            </span>);
    }
}
let FormattedHeaderColumn = (params) =>{
    return (<th><TableHeaderMenu field={params.field} definition={params.definition}/>&nbsp; {params.field.field_name}</th>);
};
let ColumnHeaderGroup = (params)=>{
    return (
        <thead>
        <tr><td/>
            {(params.definition.fields || []).map((field, index)=>{
                return <FormattedHeaderColumn key={"table-header-" + field.field_name + "-" + index} field={field} index={index} definition={params.definition} />;})}
        </tr>
        </thead>
    );
};
let ColumnFooterGroup = (params) =>{
    return (
        <tfoot>
        <tr><td/>{(params.fields || []).map((field, index)=>{return <th key={"table-footer-" + field.field_name + "-" + index}>{field.field_name}</th>;})}</tr>
        </tfoot>
    );
};
let TableContent = (params) =>{
    return [
        <ColumnHeaderGroup key={"column-headers"} definition={params.definition}/>,
        <tbody key={"table-body"}>
        {params.children}
        </tbody>,
        <ColumnFooterGroup key={"column-footers"} fields={params.definition.fields} />];
};
let TableNav = (params)=>{
    return (
        <div>
            <button className="btn btn-primary" onClick={params.ops.onAdd}>Add</button>&nbsp;
            {params.children}
        </div>);
};
let DeleteButton = (params)=>{
    return (<td style={{width:"100px"}}><a className="nav-link" onClick={params.onClick}><TimesCircle/>&nbsp;Delete</a></td>)
};
let DefaultActions = (params) =>{
    return [<DeleteButton onClick={params.ops.onDelete}/>];
};
export class TableCollectionBuilder extends Component{
    constructor(props){
        super();
        this.service_manager = ObjContainer.resolve("service_manager");
        this.state = {filter:{},rows:props.rows || [],definition:(props.config || {fields:[]})};
    }
    async componentDidMount(){
        if(this.service_manager.hasType(this.props.config.table_name)) {
            if(!this.props.parent_data){
                this.service_manager.resolve(this.props.config.table_name).addListener("update-grid", async () => {
                    this.data_def = await this.service_manager.resolve(this.props.config.table_name).get({});
                    this.setState({rows: this.data_def.data.data,
                        paging: {count:this.data_def.data.count,page:this.data_def.data.page || 1, page_size: this.data_def.data.page_size},
                        definition: this.data_def.schema_def});

                });
                this.data_def = await this.service_manager.resolve(this.props.config.table_name).get({});
                this.setState({rows: this.data_def.data.data,
                    paging: {count:this.data_def.data.count,page:this.data_def.data.page || 1, page_size: this.data_def.data.page_size},
                    definition: this.data_def.schema_def});
            }
            if (this.props.parent_data) {
                this.service_manager.resolve(this.props.config.table_name).addListener("filter-updated", async (filter) => {
                    this.service_manager.resolve(this.props.parent_data.parent_collection).emit("update-filter", filter);
                    this.setState({filter});

                });
            } else {
                this.service_manager.resolve(this.props.config.table_name).addListener("filter-updated", async (filter) => {
                    this.data_def = await this.service_manager.resolve(this.props.config.table_name).get(filter);
                    this.setState({
                        rows: (this.data_def.data.data),
                        paging: {count:this.data_def.data.count,page:this.data_def.data.page || 1, page_size: this.data_def.data.page_size},
                        definition: this.data_def.schema_def,
                        filter:filter
                    });
                });
            }
        }
    }
    _updatePaging(paging){
        if(paging === this.state.paging.page) return;
        if(paging < 1) return;
        if(paging > Math.ceil(this.state.paging.count / this.state.paging.page_size)) return;
        let filter = this.state.filter;
        filter.page = paging;
        this.service_manager.resolve(this.props.config.table_name).emit("filter-updated", this.state.filter);
    }
    _onAdd(){
        let route = this.props.config.routes.find(route => route.route_key === "add");
        ObjContainer.resolve("nav").navTo(route.route_dest,
            {parent_data: Object.assign({},this.props.parent_data || {},{back_state:ObjContainer.resolve("nav").getState() })} );
        this.service_manager.emit("form_setup",this.props.config);
    }
    _tableNav(field, row){
        let local_state = {route_params:{filter:{}},
            parent_data: Object.assign({},this.props.parent_data || {},{back_state:ObjContainer.resolve("nav").getState()})};
        local_state.route_params.filter[field.link_field] = row[field.link_field];
        ObjContainer.resolve("nav").navTo(field.link, local_state);
        this.service_manager.emit("form_setup",this.props.config);
    }
    async _onDelete(row){
        await this.service_manager.resolve(this.props.config.table_name).delete(row._id);
        this.service_manager.resolve(this.state.definition.table_name).emit("update-grid");
    }

    render(){
        return (
            <div>
                <h2>{this.props.config.title}</h2>
                <TableNav ops={{onAdd:this._onAdd.bind(this)}}>
                    <TableFeatures definition={this.state.definition}/>
                </TableNav>
                <Pager paging={this.state.paging || {}} onPage={this._updatePaging.bind(this)}/>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <TableContent definition={this.state.definition}>
                            {(this.state.rows || []).map((row,index)=>{
                                return (<tr key={"table-row-" + index}><DefaultActions ops={{onDelete: this._onDelete.bind(this,row)}} />{this.state.definition.fields.map((field, col_index)=>{
                                    if(row[field.field_code] instanceof Object){
                                        if(field.link)
                                            return (
                                                <td key={"table-row-" + index + '-' + col_index}>
                                                    <a className="nav-link" onClick={this._tableNav.bind(this, field, row)}>{row[field.field_code].display || 'empty'}</a>
                                                </td>);
                                        else
                                            return (<td  key={"table-row-" + index + '-' + col_index}>{row[field.field_code].display}</td>);
                                    }else{
                                        if(field.link)
                                            return (
                                                <td key={"table-row-" + index + '-' + col_index}>
                                                    <a className="nav-link" onClick={this._tableNav.bind(this, field, row)}>{row[field.field_code] || 'empty'}</a>
                                                </td>);
                                        else
                                            return (<td  key={"table-row-" + index + '-' + col_index}>{row[field.field_code]}</td>);
                                    }
                                })}</tr>);
                            })}
                        </TableContent>
                    </table>
                </div>
                <Pager paging={this.state.paging|| {}} onPage={this._updatePaging.bind(this)}/>
            </div>
        );
    }
}