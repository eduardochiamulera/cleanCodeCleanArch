import { inject } from "../../infra/di/DI";
import AccountGateway from "../../infra/gateway/AccountGateway";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {

    @inject("rideRepository")
    rideRepository?: RideRepository;
    @inject("accountGateway")
    accountGateway!: AccountGateway;

    async execute (input: Input) : Promise<void> {
        const account = await this.accountGateway?.getAccountById(input.driverId);
        if(!account) throw new Error("Account not found");
        if(!account.isDriver) throw new Error("Account must be from a driver");

        const ride = await this.rideRepository?.getRideById(input.rideId);

        if(!ride) throw new Error("Ride not found");

        ride.accepted(input.driverId);

        await this.rideRepository?.updateRide(ride);
    }
}

type Input = {
    rideId: string,
    driverId: string
}
