import UUID from "../vo/UUID";

export default class Transaction {
    private transactionId: UUID;
    private rideId: UUID;
    private amount: number;
    private date: Date;
    private status: string;

    constructor(transactionId: string, rideId: string, amount: number, date: Date, status: string){
        this.transactionId = new UUID(transactionId);
        this.rideId = new UUID(rideId);
        this.amount = amount;
        this.date = date;
        this.status = status;
    }

    getRideId(){
        return this.rideId.getValue();
    }

    getTransactionId(){
        return this.transactionId.getValue();
    }
    
    getAmount(){
        return this.amount;
    }
    
    getDate(){
        return this.date;
    }

    getStatus(){
        return this.status;
    }

    pay(){
        this.status = "payed";
    }
}

export class TransactionFactory {
    static create(rideId: string, amount: number){
        const transactionId: UUID = UUID.create();
        const date: Date = new Date();
        const status = "waiting_payment";
        return new Transaction(transactionId.getValue(), rideId, amount, date, status);
    }
}