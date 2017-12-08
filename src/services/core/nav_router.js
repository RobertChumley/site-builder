import React from 'react';
import {TableMasterComponent} from "../../components/TableDriver/TableMasterComponent";
import EventEmitter from 'events';
import {FormMasterComponent} from "../../components/FormDriver/FormMasterComponent";
import {IntegrationForm} from "../../components/ApiManager/ApiEditor/IntegrationForm";
import {ReportsBuilder} from "../../components/Reports/ReportsBuilder";
import {HomePageComponent} from "../../components/HomePage/HomePageComponent";

export class NavRouter extends EventEmitter{
    constructor(){
        super();
        this.routes = {
            "Home" : (<HomePageComponent />),
            "System#Tables" : (<div key={"system-tables"}><TableMasterComponent config={{table_name:"tables",title:"Tables",routes:[{route_key:"add",route_dest:"System#NewTable"}] }} /></div>),
            "System#NewTable" : (<div key={"system-tables-new"}><FormMasterComponent config={{table_name:"tables",title:"New Table",routes:[{route_key:"list",route_dest:"System#Tables"}]}} /></div>),
            "System#Fields" : (<div key={"system-fields"}><TableMasterComponent config={{table_name:"fields",title:"Fields",routes:[{route_key:"add",route_dest:"System#NewField"}] }} /></div>),
            "System#NewField" : (<div key={"system-fields-new"}><FormMasterComponent config={{table_name:"fields",title:"New Field",routes:[{route_key:"list",route_dest:"System#Fields"}]}} /></div>),
            "System#Apis" : (<div key={"system-fields-new"}><TableMasterComponent config={{table_name:"external_apis",title:"External APIs",routes:[{route_key:"add",route_dest:"System#NewApi"}] }} /></div>),
            "System#NewApi" : (<div key={"system-fields-new"}><IntegrationForm config={{table_name:"fields",title:"New Field",routes:[{route_key:"list",route_dest:"System#Fields"}]}} /></div>),
            "System#Users" : (<div key={"system-fields-new"}><TableMasterComponent config={{table_name:"users",title:"Users",routes:[{route_key:"add",route_dest:"System#NewUser"}] }} /></div>),
            "System#NewUser" : (<div key={"system-fields-new"}><FormMasterComponent config={{table_name:"users",title:"New User",routes:[{route_key:"list",route_dest:"System#Users"}]}} /></div>),
            "System#Reports" : (<div key={"system-fields-new"}><TableMasterComponent config={{table_name:"reports",title:"Reports",routes:[{route_key:"add",route_dest:"System#newReports"}] }} /></div>),
            "System#newReports" : (<div key={"system-fields-new"}><ReportsBuilder config={{table_name:"reports",title:"Reports",routes:[]}} /></div>)
        };
        this.navMenu =[
            {display:"Home", link:"Home"},
            {display:"System", link:"System", children: [
                {display:"tables", link:"System#Tables"},
                {display:"new table", link:"System#NewTable"},
                {display:"APIs", link:"System#Apis"},
                {display:"new API", link:"System#NewApi"},
                {display:"Users", link:"System#Users"},
                {display:"New User", link:"System#NewUser"},
                {display:"Reports", link:"System#Reports"},
                {display:"New Report", link:"System#newReports"}
            ]},
        ];
    }
    addRoutes(routes){
        let home = this.navMenu[0];
        let system = this.navMenu[1];
        this.navMenu = [home].concat(routes);
        this.navMenu.push(system);
        this.emit("table_updated")
    }
    addComponents(components){
        Object.keys(components).forEach((component)=>{
            this.routes[component] = components[component];
        });
    }
    navTo(route, state){
        window.history.pushState(Object.assign({},{path:route},state),route,route);
        this.emit("nav",route);
    }
    getState(){
        return window.history.state || {};
    }
    getMenuList(){
        return this.navMenu;
    }
    getRouteContent(route){
        return this.routes[route] || <div>No Route Indexed</div>;
    }

}