import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { Regestry } from "./infra/di/DI";
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

httpServer.listen(3000);
