import sinon from "sinon";
import Signup from "../src/application/usecase/Signup";
import GetAccount from "../src/application/usecase/GetAccount";
import { Regestry } from "../src/infra/di/DI";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";

let signup: Signup;
let getAccount: GetAccount;

// Integration Narrow -> Broad
beforeEach(() => {
	Regestry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
	Regestry.getInstance().provide("mailerGateway", new MailerGatewayMemory());
	Regestry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
	signup = new Signup();
	getAccount = new GetAccount();
});

test("Deve criar a conta de um passageiro com senha em md5", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true,
		passwordType: "md5"
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.password).toBe("e10adc3949ba59abbe56e057f20f883e");
});

test("Deve criar a conta de um passageiro com senha em sha1", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true,
		passwordType: "sha1"
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.password).toBe("7c4a8d09ca3762af61e59520943dc26494f8941b");
});

test("Deve criar a conta de um passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.password).toBe(input.password);
});

test("Não deve criar a conta de um passageiro com nome inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Deve criar a conta de um passageiro com stub", async function () {
	const mailerStub = sinon.stub(MailerGatewayMemory.prototype, "send").resolves();
	const getAccountByEmail = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountByEmail").resolves();
	const input = {
		name: "John Doe",
		email: `john.doe@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.password).toBe(input.password);
	mailerStub.restore();
	getAccountByEmail.restore();
});

test("Deve criar a conta de um passageiro com spy", async function () {
	const mailerSpy = sinon.spy(MailerGatewayMemory.prototype, "send");
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.password).toBe(input.password);
	expect(mailerSpy.calledOnce).toBe(true);
	expect(mailerSpy.calledWith(input.email, "Welcome!", "...")).toBe(true);
	mailerSpy.restore();
});

test("Deve criar a conta de um passageiro com mock", async function () {
	const mailerMock = sinon.mock(MailerGatewayMemory.prototype);
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	mailerMock.expects("send").withArgs(input.email, "Welcome!", "...").once().callsFake(() => {
		console.log("abc");
	});
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.password).toBe(input.password);
	mailerMock.verify();
	mailerMock.restore();
});

afterEach(async () => {
    const connection = Regestry.getInstance().inject("databaseConnection");
    await connection.close();
});
