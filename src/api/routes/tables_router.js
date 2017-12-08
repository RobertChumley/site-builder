import {RouterBase} from "./router_base";
import {TablesController} from "../controller/TablesController";
import {DefaultSchemas} from "../data/default_schema";

export class TablesRouter extends RouterBase{
    constructor(){
        super();
        this.controller = new TablesController();
    }
    async schema(req, res) {
        console.log(req.originalUrl);
        res.json({data: DefaultSchemas.getDefault("tables")});
    }
    async search(req, res) {
        console.log(req.originalUrl);
        let data= await this.controller.getRecords({});
        res.json({data: data,schema_def: DefaultSchemas.getDefault("tables")});
    }
    async getById(id, req, res) {
        console.log(req.originalUrl);
        let data= await this.controller.getById(id);
        res.json({data:data});
    }
    async post(req, res) {
        let result = await this.controller.add(req.body);
        res.json({result: result});
    }
    async put(id, req, res) {
        let result = await this.controller.update(id, req.body);
        res.json({result: result});
    }
    async patch(id, req, res) {
        let result = await this.controller.patch(id, req.body);
        res.json({result: result});
    }
    async deleteById(id, req, res) {
        let result = await this.controller.deleteOne(id);
        res.json({result: result});
    }
}