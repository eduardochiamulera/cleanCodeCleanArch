import express, { Request, Response } from "express";
import { AccountDAODatabase } from "./accountDAO";
import Signup from "./signup";
import GetAccount from "./getAccount";


const app = express();
app.use(express.json());

app.post("/signup", async function (req: Request, res: Response) {
    const input = req.body;
    try{
        const accountDAO = new AccountDAODatabase();
		const signup = new Signup(accountDAO);
		const output = await signup.execute(input);
        res.json(output);
    }catch(error: any){
        console.log(error);
        res.status(422).json({ message: error.message });
    }
});

app.get("/accounts/:accountId", async function (req: Request, res: Response) {
    const accountDAO = new AccountDAODatabase();
	const getAccount = new GetAccount(accountDAO);
	const output = await getAccount.execute(req.params.accountId);
    res.json(output);
});

app.listen(3000);