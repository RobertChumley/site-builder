import { Router } from 'express';
import {ExternalApiController} from "../controller/ExternalApiController";
let bodyParser = require('body-parser');

export class ExternalApiRequestRouter{
    constructor(){
        this.router = new Router();
        this.router.use(bodyParser.json());
        this.router.use(bodyParser.urlencoded({ extended: true }));

        this.router.route('/test').post(async (req,res,next)=>{
            await this.test(req,res,next);
        });
    }
    async test(req,res,next){
        let externalApi = new ExternalApiController();
        let ext_res = await externalApi.test(req.body);
        res.json(ext_res);
    }

}