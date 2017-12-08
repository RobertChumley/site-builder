import {ServiceManager} from "./service_manager";
import {NavRouter} from "./core/nav_router";
import {UserManagementService} from "./user_management_service";

const container = {};
export class ObjContainer {
    static async initialize(){
        ObjContainer.register('nav',new NavRouter());
        ObjContainer.register('service_manager', new ServiceManager());
        ObjContainer.register('user_manager', new UserManagementService());
        await ObjContainer.resolve('service_manager').initialize();
    }
    static register(type_name, type_def){
        container[type_name] = type_def;
    }
    static resolve(type_name){
        return container[type_name];
    }
}

export class ScopedObjContainer {
    constructor(){
        this.container = {};
    }
    initialize(){

        return this;
    }
    register(type_name, type_def){
        this.container[type_name] = type_def;
        return this;
    }
    resolve(type_name){
        return this.container[type_name];
    }
}