import { inject } from "../../infra/di/DI";
import TransactionRepository from "../../infra/repository/TransactionRepository";

export default class GetTransaction {

    @inject("transactionRepository")
    transactionRepository!: TransactionRepository;

    async execute (transactionId: string) : Promise<Output> {
        const transaction = await this.transactionRepository?.getTransactionById(transactionId);
        if(!transaction) throw new Error("Transaction not found");
        return {
            rideId: transaction.getRideId(),
            amount: transaction.getAmount(),
            status: transaction.getStatus()
        };
    }
}

type Output = {
    rideId: string,
    amount: number,
    status: string
}
