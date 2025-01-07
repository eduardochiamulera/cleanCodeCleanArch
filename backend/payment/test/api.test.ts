import axios from "axios";
import crypto from "crypto";

axios.defaults.validateStatus = function () {
	return true;
}

test("Deve criar um pagamento", async function () {
	const input = {
		rideId: crypto.randomUUID(),
    	amount: 30
	};
	
	const responseInput = await axios.post("http://localhost:3001/transaction", input);
	const response = responseInput.data;
	expect(response.transactionId).toBeDefined();
	
	const responseGetTransaction = await axios.get(`http://localhost:3001/transactions/${response.transactionId}`);

	const outputGetTransaction = responseGetTransaction.data;
	expect(outputGetTransaction.rideId).toBe(input.rideId);
	expect(outputGetTransaction.amount).toBe(input.amount);
	expect(outputGetTransaction.status).toBe("payed");
});
