export default class Util{
 
    static validateName(name: string){
        return name.match(/[a-zA-Z] [a-zA-Z]+/);
    }

    static validateEmail(email: string){
        return email.match(/^(.+)@(.+)$/);
    }
}