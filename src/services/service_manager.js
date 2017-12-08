import {ObjContainer, ScopedObjContainer} from "./object_container";
import {TableService} from "./table_service";
import {NavRouter} from "./core/nav_router";
import {GenericTableService} from "./generic_table_service";
import EventEmitter from 'events';
import React from 'react';
import {TableMasterComponent} from "../components/TableDriver/TableMasterComponent";
import {FormMasterComponent} from "../components/FormDriver/FormMasterComponent";

export class ServiceManager extends EventEmitter{
    constructor(){
        super();
        this.service_obj_container = new ScopedObjContainer();
        this.service_obj_container.register("tables", new TableService());
        this.service_obj_container.register("fields", new GenericTableService({table_name:"fields"}));
        this.service_obj_container.register("users", new GenericTableService({table_name:"users"}));
        this.service_obj_container.register("external_apis", new GenericTableService({table_name:"external_apis"}));
        this.service_obj_container.register("reports", new GenericTableService({table_name:"reports"}));
        this.nav_router = new NavRouter();
    }
    async initialize(){
        let tables_data = await this.service_obj_container.resolve("tables").get({});
        this.tables = tables_data.data.data;
        this.tables.forEach((table)=>{
            this.service_obj_container.register(table.table_name, new GenericTableService({table_name:table.table_name}));
        });
        let routes = this.tables.map((table,index)=>{
            return {link:table.table_name,display:(table.system_label || table.table_name),
                children: [{display: `${table.system_label || table.table_name}s`, link:`${table.table_name}#${table.table_name}`},{display:`new ${table.system_label || table.table_name}`, link:`${table.table_name}#New${table.table_name}`}]};
        });
        ObjContainer.resolve('nav').addRoutes(routes);
        let retComponent = {};
        this.tables.forEach((table,index)=>{
            retComponent[`${table.table_name}#${table.table_name}`] =  (<div key={`${table.table_name}-${table.table_name}`}>
                <TableMasterComponent config={{table_name:`${table.table_name}`,title:`${table.system_label || table.table_name}`,routes:[{route_key:"add",route_dest:`${table.table_name}#New${table.table_name}`}] }} />
            </div>);
            retComponent[`${table.table_name}#New${table.table_name}`] = (<div key={`${table.table_name}-${table.table_name}-new`}>
                <FormMasterComponent config={{table_name:`${table.table_name}`,title:`New ${table.system_label || table.table_name}`,routes:[{route_key:"list",route_dest:`${table.table_name}#${table.table_name}`}]}} />
            </div>);
        });
        ObjContainer.resolve('nav').addComponents(retComponent);
    }
    resolve(type_name){
        return this.service_obj_container.resolve(type_name);
    }
    hasType(type_name){
        return this.service_obj_container.resolve(type_name) !== undefined;
    }
}