
import {GenericTableService} from "./generic_table_service";

export class TableService extends GenericTableService{
    constructor(){
        super({table_name:"tables"});
    }

}