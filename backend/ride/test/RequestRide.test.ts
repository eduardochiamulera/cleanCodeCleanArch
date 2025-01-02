import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import Signup from "../src/application/usecase/Signup";
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
});

test("Deve solicitar uma corrida", async function () {
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
    expect(outputRequestRide.rideId).toBeDefined();
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
    expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
    expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
    expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
    expect(outputGetRide.status).toBe("requested");
});

test("Não deve solicitar uma corrida se a conta não for de um passageiro", async function () {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isDriver: true,
        carPlate: "AAA9999"
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
    expect(async () => await requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account must be from a passenger"));
});

test("Não deve solicitar uma corrida se tem uma pendente", async function () {
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
    await requestRide.execute(inputRequestRide);
    expect(async () => await requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Ride already requested"));
});

afterEach(async () => {
    const connection = Regestry.getInstance().inject("databaseConnection");
    await connection.close();
});

