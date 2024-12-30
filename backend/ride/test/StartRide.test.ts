import AcceptRide from "../src/application/usecase/AcceptRide";
import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import Signup from "../src/application/usecase/Signup";
import StartRide from "../src/application/usecase/StartRide";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { Regestry } from "../src/infra/di/DI";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;

// Integration Narrow -> Broad
beforeEach(() => {
    Regestry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
    Regestry.getInstance().provide("mailerGateway", new MailerGatewayMemory());
    Regestry.getInstance().provide("rideRepository", new RideRepositoryDatabase());
    Regestry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
    signup = new Signup();
    getAccount = new GetAccount();
    requestRide = new RequestRide();
    getRide = new GetRide();
    acceptRide = new AcceptRide();
    startRide = new StartRide();
});

test("Deve iniciar uma corrida", async function () {
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

    const outputGetRide = await getRide.execute(inputAcceptRide.rideId);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
    expect(outputGetRide.status).toBe("in_progress");
});

test("Não deve iniciar uma corrida que não foi aceita", async function () {
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
    
    await signup.execute(inputSignupDriver);
    expect(async () => await startRide.execute(outputRequestRide.rideId)).rejects.toThrow(new Error("Ride already started"));
});

afterEach(async () => {
    const connection = Regestry.getInstance().inject("databaseConnection");
    await connection.close();
});

