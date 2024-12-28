import crypto from "crypto";
import { validateCpf } from "./validateCpf";

export default class Account{
    constructor(
                readonly accountId: string,
                readonly name: string, 
                readonly email: string, 
                readonly cpf: string, 
                readonly carPlate: string,
                readonly password: string,
                readonly isPassenger: boolean,
                readonly isDriver: boolean,
            ){
                if(!this.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
                if (!this.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
                if(!validateCpf(cpf)) throw new Error("Invalid cpf");
                if(this.isDriver && !this.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid carPlate");
            }

    static Create(name: string, email: string, cpf: string, carPlate: string, password: string, isPassenger: boolean, isDriver: boolean){
        const accountId = crypto.randomUUID();
        return new Account(accountId, name, email, cpf, carPlate, password, isPassenger, isDriver);
    }
}