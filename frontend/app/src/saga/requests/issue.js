import axios from "axios";

export function requestGetPost(){
    return axios.request({
        method: 'get',
        url:'https://jsonplaceholder.typicode.com/posts'
    })
 }