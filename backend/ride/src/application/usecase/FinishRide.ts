import { inject } from "../../infra/di/DI";
import PositionRepository from "../../infra/repository/PositionRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class FinishRide {
    @inject("rideRepository")
    rideRepository?: RideRepository;
    @inject("positionRepository")
    positionRepository?: PositionRepository;

    async execute (rideId: string) : Promise<void> {
        const ride = await this.rideRepository?.getRideById(rideId);
        if(!ride) throw new Error("Ride not found");
        const positions = await this.positionRepository?.getPositionsByRideId(rideId);
        ride.finish(positions || []);        
        await this.rideRepository?.updateRide(ride);
    }
}