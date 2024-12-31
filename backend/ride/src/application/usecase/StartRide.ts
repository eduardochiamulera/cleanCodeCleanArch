import { RequestedStatus } from "../../domain/vo/RideStatus";
import { inject } from "../../infra/di/DI";
import RideRepository from "../../infra/repository/RideRepository";

export default class StartRide {
    @inject("rideRepository")
    rideRepository?: RideRepository;

    async execute (rideId: string) : Promise<void> {
        const ride = await this.rideRepository?.getRideById(rideId);

        if(!ride) throw new Error("Ride not found");

        ride.start();

        await this.rideRepository?.updateRide(ride);
    }
}