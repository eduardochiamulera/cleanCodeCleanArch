import Ride from "../../domain/Ride";
import { DatabaseConnection } from "../database/DatabaseConnection";
import { inject } from "../di/DI";

// Port
export default interface RideRepository {
	saveRide (ride: Ride): Promise<void>;
	getRideById(rideId: string): Promise<Ride>;
}

// Adapter
export class RideRepositoryDatabase implements RideRepository {

	@inject("databaseConnection")
	connection?: DatabaseConnection;

	async getRideById(rideId: string): Promise<Ride> {
		const [rideData] = await this.connection?.query("select * from ccca.ride where ride_id = $1", [rideId]);
		if(!rideData) throw new Error("Ride not found");
		return new Ride(rideData.ride_id, rideData.passenger_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date);
	}

	async saveRide (ride: Ride) {
		await this.connection?.query(`insert into ccca.ride (ride_id, passenger_id, from_lat, 
			from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)`, 
			[ride.getRideId(), ride.getPassengerId(), ride.getFrom().getLat(), ride.getFrom().getLong(), ride.getTo().getLat(), ride.getTo().getLong(), ride.getStatus(), ride.getDate()]);
	}
}
