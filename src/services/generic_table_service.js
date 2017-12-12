import EventEmitter from 'events';
import axios from 'axios';

export class GenericTableService extends EventEmitter{
    constructor(props){
        super();
        this.props = props;
    }
    async get(filter){
        let ret = await axios.get(`/api/${this.props.table_name}?${this._prepareFilter(filter)}`);
        return ret.data;
    }
    async getOne(filter){
        let ret = await axios.get(`/api/${this.props.table_name}?${this._prepareFilter(filter)}`);
        return ret.data.data[0];
    }
    async upload(data){
        let ret = await axios.post(`/api/${this.props.table_name}/upload`,{data:btoa(data)});
        return ret.data.data;
    }
    _prepareFilter(filter){
        let ret_array = [];
        Object.keys(filter.filter || {}).forEach((key)=>{
            if(filter.filter[key] !== null && filter.filter[key] !== '')
                ret_array.push(`filter[${key}]=${filter.filter[key]}`);
        });
        if(filter.expand){
            let exp_str = Object.keys(filter.expand || {}).map(key => filter.expand[key]).join(',');
            ret_array.push(`expand=${exp_str}`);

        }

        if(filter.sort)
            ret_array.push(`sort[${filter.sort.field_code}]=${filter.sort.sort_direction}`);
        if(filter.page){
            ret_array.push(`page=${filter.page}`)
        }
        return ret_array.join('&');
    }
    async upsert(id, data){
        let ret ={};
        if(id)
            ret = await axios.patch(`/api/${this.props.table_name}/${id}`,data);
        else
            ret = await axios.post(`/api/${this.props.table_name}`,data);
        return ret.data;
    }
    async getById(filter){
        if(!filter.filter._id) return {};
        let ret = await axios.get(`/api/${this.props.table_name}/${filter.filter._id}?${this._prepareFilter(filter)}`);
        return ret.data.data;
    }
    async delete(id){
        let ret = await axios.delete(`/api/${this.props.table_name}/${id}`,{});
        return ret.data;
    }
    async schema(){
        let ret = await axios.get(`/api/${this.props.table_name}/_schema`,{});
        return ret.data;
    }
    async history(id){
        let ret = await axios.get(`/api/${this.props.table_name}/${id}/_history`,{});
        return ret.data;
    }
}