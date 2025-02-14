import AcceptRide from "../src/application/usecase/AcceptRide";
import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { Regestry } from "../src/infra/di/DI";
import AccountGateway from "../src/infra/gateway/AccountGateway";
import { PositionRepositoryDatabase } from "../src/infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";

let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let accountGateway: AccountGateway;

// Integration Narrow -> Broad
beforeEach(() => {
    accountGateway = new AccountGateway();
    Regestry.getInstance().provide("rideRepository", new RideRepositoryDatabase());
    Regestry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
    Regestry.getInstance().provide("positionRepository", new PositionRepositoryDatabase());
	Regestry.getInstance().provide("accountGateway", accountGateway);

    requestRide = new RequestRide();
    getRide = new GetRide();
    acceptRide = new AcceptRide();
});

test("Deve aceitar uma corrida", async function () {
    const inputSignupPassenger = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true
    };
    const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);
    
    const inputSignupDriver = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isDriver: true,
        carPlate: "AAA9999"
    }

    const outputSignupDriver = await accountGateway.signup(inputSignupDriver);

    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    };
    const outputRequestRide = await requestRide.execute(inputRequestRide);

    var inputAcceptRide = {
        driverId: outputSignupDriver.accountId,
        rideId: outputRequestRide.rideId
    }

    await acceptRide.execute(inputAcceptRide);

    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
    expect(outputGetRide.status).toBe("accepted");
});

test("Não deve aceitar uma corrida se a conta não for motorista", async function () {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true
    };
    const outputSignup = await accountGateway.signup(inputSignup);
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
        isPassenger: true
    }

    const outputSignupDriver = await accountGateway.signup(inputSignupDriver);

    var inputAcceptRide = {
        driverId: outputSignupDriver.accountId,
        rideId: outputRequestRide.rideId
    }

    expect(async () => await acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Account must be from a driver"));
});

test("Não deve aceitar uma corrida que ja foi aceita", async function () {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true
    };
    const outputSignup = await accountGateway.signup(inputSignup);
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

    const outputSignupDriver = await accountGateway.signup(inputSignupDriver);

    var inputAcceptRide = {
        driverId: outputSignupDriver.accountId,
        rideId: outputRequestRide.rideId
    }

    await acceptRide.execute(inputAcceptRide);
    expect(async () => await acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Invalid status"));
});

test("Não deve aceitar uma corrida com outra ja aceita ou em progresso", async function () {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true
    };
    const outputSignup = await accountGateway.signup(inputSignup);
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

    const outputSignupDriver = await accountGateway.signup(inputSignupDriver);

    const inputAcceptRide = {
        driverId: outputSignupDriver.accountId,
        rideId: outputRequestRide.rideId
    }

    await acceptRide.execute(inputAcceptRide);

    const inputSignupTwo = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true
    };
    const outputSignupTwo = await accountGateway.signup(inputSignupTwo);
    
    const inputRequestRideTwo = {
        passengerId: outputSignupTwo.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    };
    const outputRequestRideTwo = await requestRide.execute(inputRequestRideTwo);

    const inputAcceptRideTwo = {
        driverId: outputSignupDriver.accountId,
        rideId: outputRequestRideTwo.rideId
    }

    expect(async () => await acceptRide.execute(inputAcceptRideTwo)).rejects.toThrow(new Error("There is a ride already accepted"));
});

afterEach(async () => {
    const connection = Regestry.getInstance().inject("databaseConnection");
    await connection.close();
});

