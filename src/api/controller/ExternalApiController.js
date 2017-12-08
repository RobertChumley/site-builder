import {ExternalApiDriver} from "../integrations/ExternalApiDriver";
import {SchemaController} from "./SchemaController";

export class ExternalApiController{

    async test(request_config){
        let externalApiDriver = new ExternalApiDriver();
        let schemaController = new SchemaController({collection:"external_apis"});
        let authData = {};
        if(request_config.auth_request_key){
            let external_auth_api = await schemaController.getRecords({filter:{global_key:request_config.auth_request_key}});
            let external_auth =external_auth_api.data[0];
            let auth_params = {};
            (external_auth.params || []).forEach((param)=>{
                auth_params[param.url_key] = param.url_value;
            });
            let retData = await externalApiDriver.authenticate(external_auth,auth_params);
            authData = retData.data;
        }
        let params = {};
        request_config.params.forEach((param)=>{
            params[param.url_key] = param.url_value;
        });
        if(authData["access_token"]){
            switch(request_config.request_type){
                case "get":
                    let data = await externalApiDriver.getFrom(request_config,params,{headers:{'Authorization':`Bearer ${authData["access_token"]}`}});
                    if(request_config.mapping){
                        let ret_obj = {};
                        (request_config.mapping).forEach((mapping)=>{
                            ret_obj[mapping.target] = this.capture(data, mapping.source);
                        });
                        return ret_obj;
                    }
                    return data;
            }
        }else{
            let data = await externalApiDriver.authenticate(request_config,params);
            return data.data;
        }
    }
    capture(data, mapping){
        let parts = (mapping || "").split('.');
        if(parts.length > 0 && parts[0] !== ''){
            if(parts[0].indexOf('[') >-1){
                let ret = parts[0].substring(0,parts[0].indexOf('['));
                let sub_values = [];
                data[ret].forEach((item)=>{
                    sub_values.push(this.capture(item, mapping.substring(parts[0].length+1)));
                });
                return sub_values;
            }else{
                return this.capture(data[parts[0]], mapping.substring(parts[0].length+1));
            }
        }else{
            return data;
        }

    }

}