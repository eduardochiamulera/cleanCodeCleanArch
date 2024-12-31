import Ride from "../../domain/entity/Ride";
import { inject } from "../../infra/di/DI";
import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class RequestRide {

    @inject("accountRepository")
    accountRepository?: AccountRepository;
    @inject("rideRepository")
    rideRepository?: RideRepository;

    async execute (input: Input) : Promise<Output> {
        const account = await this.accountRepository?.getAccountById(input.passengerId);

        if(!account) throw new Error("Account not found");

        if(!account.isPassenger) throw new Error("Account must be from a passenger");

        const rides = await this.rideRepository?.getRidesByPassengerId(input.passengerId);

        if(rides && rides.some(ride => ride.getStatus() !== "completed")) throw new Error("Ride already requested");

        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);

        await this.rideRepository?.saveRide(ride);

        //DTO - Data Transfer object
        return {
            rideId: ride.getRideId(),
        };
    }
}

type Input = {
    passengerId: string,
    fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number
}

type Output = {
    rideId: string;
}
