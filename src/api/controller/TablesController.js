import {SchemaController} from "./SchemaController";

export class TablesController extends SchemaController{
    constructor(){
        super({collection:"tables"});
    }
}