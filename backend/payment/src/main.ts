import GetTransaction from "./application/usecase/GetTransaction";
import ProcessPayment from "./application/usecase/ProcessPayment";
import PaymentController from "./infra/controller/PaymentController";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { Regestry } from "./infra/di/DI";
import { ExternalPaymetGateway } from "./infra/gateway/PaymentGateway";
import { ExpressAdpater } from "./infra/http/HttpServer";
import { TransactionRepositoryDatabase } from "./infra/repository/TransactionRepository";

const httpServer = new ExpressAdpater();
Regestry.getInstance().provide("httpServer", httpServer);
Regestry.getInstance().provide("transactionRepository", new TransactionRepositoryDatabase());
Regestry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
Regestry.getInstance().provide("paymentController", new PaymentController());
Regestry.getInstance().provide("paymentGateway", new ExternalPaymetGateway());
Regestry.getInstance().provide("getTransaction", new GetTransaction());
Regestry.getInstance().provide("processPayment", new ProcessPayment());

httpServer.listen(3001);
