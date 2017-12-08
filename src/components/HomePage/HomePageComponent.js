import React, { Component } from 'react';
import {ObjContainer} from "../../services/object_container";
import reportTest from '../Reports/reportTest'
export class HomePageComponent extends Component{

    constructor(){
        super();
        this.state ={reports:[]};
        this.service_manager = ObjContainer.resolve("service_manager");
    }
    async componentDidMount(){
        let tables_data = await this.service_manager.resolve("reports").get({filter:{on_dashboard:true}});
        this.setState({reports:tables_data.data.data});
        (tables_data.data.data || []).map(async (item,index)=>{
            let tables_data = await this.service_manager.resolve(item["source_table"]).get({});
            reportTest.render(Object.assign({item_id: "#report_table_" + index,data:tables_data.data.data},item))
        });
    }
    render(){
        return (<div>
            <h2>Dashboard</h2>
            {this.state.reports.map((data,index)=>{
                return <div className={"panel panel-default"} style={{width:data.width + 20}}>
                    <div className={"panel-heading"}>{data.report_name}</div>
                    <div className="panel-body">
                        <div id={"report_table_" + index} />
                    </div>
                </div>
            })}
        </div>)
    }
}