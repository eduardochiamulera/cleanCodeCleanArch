import { AccountDAODatabase, AccountDAOMemory } from "../src/accountDAO";
import GetAccount from "../src/getAccount";
import Signup from "../src/signup";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
	const accountDAO = new AccountDAODatabase();
	// fake
	// const accountDAO = new AccountDAOMemory();
	// fake
	signup = new Signup(accountDAO);
	getAccount = new GetAccount(accountDAO);
});

test("Deve criar a conta de um passageiro", async function(){
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "71428793860",
        password: "123456",
        isPassenger: true,
        isDriver: false,
    };
    const response = await signup.execute(input);
    expect(response.accountId).toBeDefined();

    const outputGetAccount = await getAccount.execute(response.accountId); 
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    //expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test("Não Deve criar a conta de um passageiro com nome inválido", async function(){
    const input = {
        name: "John",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "71428793860",
        password: "123456",
        isPassenger: true,
        isDriver: false,
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não Deve criar a conta de um passageiro com email inválido", async function(){
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}`,
        cpf: "71428793860",
        password: "123456",
        isPassenger: true,
        isDriver: false,
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não Deve criar a conta de um passageiro com cpf inválido", async function(){
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "11111111111",
        password: "123456",
        isPassenger: true,
        isDriver: false,
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não Deve criar a conta de um passageiro duplicado", async function(){
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "71428793860",
        password: "123456",
        isPassenger: true,
        isDriver: false,
    };
    await signup.execute(input);
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Duplicated account"));
});

test("Não Deve criar a conta de um motorista com placa invalida", async function(){
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "71428793860",
        password: "123456",
        isPassenger: false,
        isDriver: true,
        carPlate: "AAA999"
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"));
});