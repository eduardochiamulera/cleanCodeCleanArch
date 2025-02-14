import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { Regestry } from "./infra/di/DI";
import AccountGateway from "./infra/gateway/AccountGateway";
import PaymentGateway from "./infra/gateway/PaymentGateway";
import { ExpressAdpater } from "./infra/http/HttpServer";
import Mediator from "./infra/mediator/Mediator";
import { PositionRepositoryDatabase } from "./infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "./infra/repository/RideRepository";

const httpServer = new ExpressAdpater();
const mediator = new Mediator();
Regestry.getInstance().provide("mediator", mediator);
Regestry.getInstance().provide("httpServer", httpServer);
Regestry.getInstance().provide("rideRepository", new RideRepositoryDatabase());
Regestry.getInstance().provide("positionRepository", new PositionRepositoryDatabase());
Regestry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
Regestry.getInstance().provide("accountGateway", new AccountGateway());
Regestry.getInstance().provide("paymentGateway", new PaymentGateway());

httpServer.listen(3002);
