import CarPlate from ".././vo/CarPlate";
import Cpf from "../vo/Cpf";
import Email from "../vo/Email";
import Name from "../vo/Name";
import Password, { PasswordFactory } from "../vo/Password";
import UUID from "../vo/UUID";

//Entity - Clean Arch
//Entity - DDD
export default class Account{

    private accountId: UUID;
    private name: Name;
    private email: Email;
    private cpf: Cpf;
    private carPlate?: CarPlate;
    private password: Password;
    
    constructor(accountId: string, name: string, email: string, cpf: string, carPlate: string, 
            password: string, readonly isPassenger: boolean, readonly isDriver: boolean, passwordType: string = "textplain" )
            {
                this.accountId = new UUID(accountId);
                this.name = new Name(name);
                this.email = new Email(email);
                this.cpf = new Cpf(cpf);
                if(isDriver) this.carPlate = new CarPlate(carPlate);
                this.password = PasswordFactory.restore(passwordType, password);
            }

    //static factory method
    static create (name: string, email: string, cpf: string, carPlate: string, 
        password: string, isPassenger: boolean, isDriver: boolean, passwordType: string = "plaintext" ){
        const accountId = UUID.create();
        console.log("passwordtype", passwordType)
        const passwordValue = PasswordFactory.create(passwordType, password);
        return new Account(accountId.getValue(), name, email, cpf, carPlate, passwordValue.getValue(), isPassenger, isDriver, passwordValue.type);
    }

    getEmail(){
        return this.email.getValue();
    }

    getName(){
        return this.name.getValue();
    }

    getCpf(){
        return this.cpf.getValue();
    }

    getCarPlate(){
        return (this.isDriver) ? this.carPlate?.getValue() : "";
    }

    getPassword(){
        return this.password.getValue();
    }

    getAccountId(){
        return this.accountId.getValue();
    }
    getPasswordType(){
        return this.password.type;
    }
}