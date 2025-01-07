import { TransactionFactory } from "../../domain/entity/Transaction";
import { inject } from "../../infra/di/DI";
import PaymentGateway from "../../infra/gateway/PaymentGateway";
import Logger from "../../infra/logger/Logger";
import TransactionRepository from "../../infra/repository/TransactionRepository";

export default class ProcessPayment {

    @inject("transactionRepository")
    transactionRepository!: TransactionRepository;
    @inject("paymentGateway")
    paymentGateway!: PaymentGateway;

    async execute(input: Input): Promise<Output> {
        console.log("processPayment", input);
        const transaction = TransactionFactory.create(input.rideId, input.amount);
        const payment = await this.paymentGateway.execute({ value: input.amount, creditCard: { ccv: 123, date: "042034", name: "John Doe" }});

        if(payment.success){
            transaction.pay();
        }

        await this.transactionRepository.saveTransaction(transaction);

        return {
            transactionId: transaction.getTransactionId()
        }
    }
}

type Output = {
    transactionId: string;
}

type Input = {
    rideId: string,
    amount: number
}