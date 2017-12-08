import {RouterBase} from "./router_base";
import {SchemaController} from '../controller/SchemaController';

export class GenericRouter extends RouterBase{
    constructor(){
        super({disableDefault: true});
        this.controller = new SchemaController({collection:"tables"});
    }
    async upload(req,res){
        let result = await this.controller.upload(req.body,req.table);
        res.json({result: result});
    }
    async schema(req, res) {
        let schema = await this.controller.schema(req.table);
        res.json({data:schema});
    }
    async search(req, res) {
        let data= await this.controller.getRecords(req.query || {},req.table);
        let schema = await this.controller.schema(req.table);
        res.json({data: data,schema_def: schema});
    }
    async getById(id, req, res) {
        let schema = await this.controller.schema(req.table);
        let data= await this.controller.getById(id,req.table, req.query || {});
        res.json({data:data,schema_def: schema });
    }
    async post(req, res) {
        let result = await this.controller.add(req.body,req.table);
        res.json({result: result});
    }
    async put(id, req, res) {
        let result = await this.controller.update(id, req.body,req.originalUrl.split('/')[2]);
        res.json({result: result});
    }
    async patch(id, req, res) {
        let result = await this.controller.patch(id, req.body,req.originalUrl.split('/')[2]);
        res.json({result: result});
    }
    async deleteById(id, req, res) {
        let result = await this.controller.deleteOne(id,req.originalUrl.split('/')[2]);
        res.json({result: result});
    }
}