import Ride from "../../domain/Ride";
import { inject } from "../../infra/di/DI";
import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class StartRide {

    @inject("accountRepository")
    accountRepository?: AccountRepository;
    @inject("rideRepository")
    rideRepository?: RideRepository;

    async execute (rideId: string) : Promise<void> {
        const ride = await this.rideRepository?.getRideById(rideId);

        if(!ride) throw new Error("Ride not found");

        if(ride.getStatus() !== "accepted") throw new Error("Ride already started");

        ride.setStatus("in_progress");

        await this.rideRepository?.updateRide(ride);
    }
}
