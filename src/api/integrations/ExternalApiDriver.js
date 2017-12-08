import axios from 'axios';

export class ExternalApiDriver{

    async getFrom(request_base, data,headers){
        let ret = await axios.get(`${request_base.url}/${request_base.path}?${Object.keys(data).map(i=>`${i}=${data[i]}`).join('&') }`,headers);
        return ret.data;
    }
    async postTo(request_base, data){
        let ret = await axios.post(`${request_base.url}/${request_base.path}`,data);
        return ret.data;
    }
    async putTo(request_base, data){
        let ret = await axios.put(`${request_base.url}/${request_base.path}`,data);
        return ret.data;
    }
    async deleteFrom(request_base, data){
        let ret = await axios.delete(`${request_base.url}/${request_base.path}`,{data:btoa(data)});
        return ret.data;
    }
    //https://api.yelp.com/oauth2/token
    async authenticate(request_base,data){
        let full_url = `${request_base.url}/${request_base.path}`;
        let ret = await axios.post(full_url,Object.keys(data).map(i=>`${i}=${data[i]}`).join('&'));
        return ret;
    }

}