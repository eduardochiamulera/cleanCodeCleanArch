import { inject } from "../../infra/di/DI";
import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {

    @inject("accountRepository")
    accountRepository?: AccountRepository;
    @inject("rideRepository")
    rideRepository?: RideRepository;

    async execute (input: Input) : Promise<void> {
        const account = await this.accountRepository?.getAccountById(input.driverId);

        if(!account) throw new Error("Account not found");

        if(!account.isDriver) throw new Error("Account must be from a driver");

        const ride = await this.rideRepository?.getRideById(input.rideId);

        if(!ride) throw new Error("Ride not found");

        const driverRides = await this.rideRepository?.getRidesByDriverId(input.driverId);

        if(driverRides && driverRides.some(ride => ride.getStatus() === "accepted" || ride.getStatus() === "in_progress")) throw new Error("There is a ride already accepted");

        ride.accepted(input.driverId);

        await this.rideRepository?.updateRide(ride);
    }
}

type Input = {
    rideId: string,
    driverId: string
}
