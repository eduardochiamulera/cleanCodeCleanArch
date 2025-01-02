import GetAccount from "./application/usecase/GetAccount";
import Signup from "./application/usecase/Signup";
import AccountController from "./infra/controller/AccountController";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { Regestry } from "./infra/di/DI";
import { MailerGatewayMemory } from "./infra/gateway/MailerGateway";
import { ExpressAdpater } from "./infra/http/HttpServer";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import { PositionRepositoryDatabase } from "./infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "./infra/repository/RideRepository";

const httpServer = new ExpressAdpater();
Regestry.getInstance().provide("httpServer", httpServer);
Regestry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
Regestry.getInstance().provide("mailerGateway", new MailerGatewayMemory());
Regestry.getInstance().provide("rideRepository", new RideRepositoryDatabase());
Regestry.getInstance().provide("positionRepository", new PositionRepositoryDatabase());
Regestry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
Regestry.getInstance().provide("signup", new Signup());
Regestry.getInstance().provide("getAccount", new GetAccount());
Regestry.getInstance().provide("accountController", new AccountController());

httpServer.listen(3000);
