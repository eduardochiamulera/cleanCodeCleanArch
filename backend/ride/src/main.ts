import GetAccount from "./application/usecase/GetAccount";
import ProcessPayment from "./application/usecase/ProcessPayment";
import Signup from "./application/usecase/Signup";
import AccountController from "./infra/controller/AccountController";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { Regestry } from "./infra/di/DI";
import { MailerGatewayMemory } from "./infra/gateway/MailerGateway";
import { ExternalPaymetGateway } from "./infra/gateway/PaymentGateway";
import { ExpressAdpater } from "./infra/http/HttpServer";
import Mediator from "./infra/mediator/Mediator";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import { PositionRepositoryDatabase } from "./infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "./infra/repository/RideRepository";
import { TransactionRepositoryDatabase } from "./infra/repository/TransactionRepository";

const httpServer = new ExpressAdpater();
const processPayment = new ProcessPayment();
const mediator = new Mediator();
mediator.register("rideCompleted", async function (data: any) {
    await processPayment.execute(data);
})
Regestry.getInstance().provide("mediator", mediator);
Regestry.getInstance().provide("httpServer", httpServer);
Regestry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
Regestry.getInstance().provide("mailerGateway", new MailerGatewayMemory());
Regestry.getInstance().provide("rideRepository", new RideRepositoryDatabase());
Regestry.getInstance().provide("positionRepository", new PositionRepositoryDatabase());
Regestry.getInstance().provide("transactionRepository", new TransactionRepositoryDatabase());
Regestry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
Regestry.getInstance().provide("signup", new Signup());
Regestry.getInstance().provide("getAccount", new GetAccount());
Regestry.getInstance().provide("accountController", new AccountController());
Regestry.getInstance().provide("paymentGateway", new ExternalPaymetGateway());


httpServer.listen(3000);
