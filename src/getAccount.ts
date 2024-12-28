import express from "express";
import { AccountRepositoryDatabase } from "./AccountRepository";
import GetByCode from "./getByCode";

const app = express();
app.use(express.json());

const accountRepository = new AccountRepositoryDatabase();
const getbyCode = new GetByCode(accountRepository);

app.get("/accounts/:accountId", async function (req: any, res: any) {
	const accountId = req.params.accountId;
	
    const output = await getbyCode.executeAsync(accountId);

    res.json(output);  
});

app.listen(3000);