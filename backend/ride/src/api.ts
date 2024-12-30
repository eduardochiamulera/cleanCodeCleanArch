import express from "express";
import Signup from "./Signup";
import { AccountRepositoryDatabase } from "./AccountRepository";
import GetAccount from "./GetAccount";
import cors from "cors";
import { MailerGatewayMemory } from "./MailerGateway";
import { Regestry } from "./DI";

const app = express();
app.use(express.json());
app.use(cors());
const accountRepository = new AccountRepositoryDatabase();
const mailerGateway = new MailerGatewayMemory();
Regestry.getInstance().provide("accountRepository", accountRepository);
Regestry.getInstance().provide("mailerGateway", mailerGateway);

app.post("/signup", async function (req, res) {
	const input = req.body;
	try {
		const signup = new Signup();
		const output = await signup.execute(input);
		res.json(output);
	} catch (e: any) {
		res.status(422).json({ message: e.message });
	}
});

app.get("/accounts/:accountId", async function (req, res) {
	const getAccount = new GetAccount();
	const output = await getAccount.execute(req.params.accountId);
	res.json(output);
});

app.listen(3000);
