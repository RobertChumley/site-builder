import EventEmitter from 'events';
let isLoggedIn = false;
export class UserManagementService extends EventEmitter{
    login(){
        isLoggedIn = true;
    }
    logout(){
        isLoggedIn = false;
    }
    isLoggedIn(){
        return isLoggedIn;
    }
}