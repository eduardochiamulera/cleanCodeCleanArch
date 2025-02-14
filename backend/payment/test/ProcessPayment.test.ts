import GetTransaction from "../src/application/usecase/GetTransaction";
import ProcessPayment from "../src/application/usecase/ProcessPayment";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { Regestry } from "../src/infra/di/DI";
import { ExternalPaymetGateway } from "../src/infra/gateway/PaymentGateway";
import Mediator from "../src/infra/mediator/Mediator";
import { TransactionRepositoryDatabase } from "../src/infra/repository/TransactionRepository";

let processPayment: ProcessPayment;
let getTransaction: GetTransaction;

// Integration Narrow -> Broad
beforeEach(() => {
    const mediator = new Mediator();
    mediator.register("rideCompleted", async function (data: any) {
        await processPayment.execute(data);
    })
    Regestry.getInstance().provide("mediator", mediator);
    Regestry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
    Regestry.getInstance().provide("paymentGateway", new ExternalPaymetGateway());
    Regestry.getInstance().provide("transactionRepository", new TransactionRepositoryDatabase());
    processPayment = new ProcessPayment();
    getTransaction = new GetTransaction();
});

test("Deve processar o pagamento de uma corrida", async function () {
    const inputProcessPayment = {
        rideId: crypto.randomUUID(),
        amount: 63
    }

    const outputTransaction = await processPayment.execute(inputProcessPayment);

    const transaction = await getTransaction.execute(outputTransaction.transactionId);

    expect(transaction.amount).toBe(63);
    expect(transaction.rideId).toBe(inputProcessPayment.rideId);
    expect(transaction.status).toBe("payed");
    
});

afterEach(async () => {
    const connection = Regestry.getInstance().inject("databaseConnection");
    await connection.close();
});
