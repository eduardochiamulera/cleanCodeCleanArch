import AcceptRide from "../src/application/usecase/AcceptRide";
import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import Signup from "../src/application/usecase/Signup";
import StartRide from "../src/application/usecase/StartRide";
import UpdatePosition from "../src/application/usecase/UpdatePosition";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { Regestry } from "../src/infra/di/DI";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import { PositionRepositoryDatabase } from "../src/infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;

// Integration Narrow -> Broad
beforeEach(() => {
    Regestry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
    Regestry.getInstance().provide("mailerGateway", new MailerGatewayMemory());
    Regestry.getInstance().provide("rideRepository", new RideRepositoryDatabase());
    Regestry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
    Regestry.getInstance().provide("positionRepository", new PositionRepositoryDatabase());
    signup = new Signup();
    getAccount = new GetAccount();
    requestRide = new RequestRide();
    getRide = new GetRide();
    acceptRide = new AcceptRide();
    startRide = new StartRide();
    updatePosition = new UpdatePosition();
});

test("Deve atualizar a posição de uma corrida de uma corrida", async function () {
    const inputSignup = {
       name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true
    };
    const outputSignup = await signup.execute(inputSignup);
    outputSignup.accountId;
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    };
    const outputRequestRide = await requestRide.execute(inputRequestRide);

    const inputSignupDriver = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isDriver: true,
        carPlate: "AAA9999"
    }
    const outputSignupDriver = await signup.execute(inputSignupDriver);

    const inputAcceptRide = {
        driverId: outputSignupDriver.accountId,
        rideId: outputRequestRide.rideId
    }
    await acceptRide.execute(inputAcceptRide);

    await startRide.execute(inputAcceptRide.rideId);

    const inputUpdatePosition1 = {
        rideId: inputAcceptRide.rideId,
        lat: -27.584905257808835,
        long: -48.545022195325124,
    }

    await updatePosition.execute(inputUpdatePosition1);

    const inputUpdatePosition2 = {
        rideId: inputAcceptRide.rideId,
        lat: -27.496887588317275,
        long: -48.522234807851476
    }
    await updatePosition.execute(inputUpdatePosition2);

    const inputUpdatePosition3 = {
        rideId: inputAcceptRide.rideId,
        lat: -27.584905257808835,
        long: -48.545022195325124,
    }
    await updatePosition.execute(inputUpdatePosition3);
    

    const inputUpdatePosition4 = {
        rideId: inputAcceptRide.rideId,
        lat: -27.496887588317275,
        long: -48.522234807851476
    }
    await updatePosition.execute(inputUpdatePosition4);

    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.distance).toBe(30);
    
});

afterEach(async () => {
    const connection = Regestry.getInstance().inject("databaseConnection");
    await connection.close();
});

