import axios from 'axios';
export class ExternalApiRequest{
    async test(data){
        return axios.post('/external/test',data)
    }
}