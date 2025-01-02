import DistanceCalculator from "../service/DistanceCalculator";
import Coord from "../vo/Coord";
import RideStatus, { RideStatusFactory } from "../vo/RideStatus";
import UUID from "../vo/UUID";
import Position from "./Position";

export default class Ride{
    private rideId: UUID;
    private from: Coord;
    private to: Coord;
    private passengerId: UUID;
    private status: RideStatus;
    private date: Date;
    private driverId?: UUID;
    private fare: number;
    private distance: number;

    constructor(rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date, fare: number, distance: number, driverId?: string){
        this.from = new Coord(fromLat, fromLong);
        this.to = new Coord(toLat, toLong);
        this.passengerId = new UUID(passengerId);
        this.rideId = new UUID(rideId);
        this.status = RideStatusFactory.create(status, this);
        this.date = date;
        if(driverId) this.driverId = new UUID(driverId);
        this.fare = fare;
        this.distance = distance;
    }
    
    static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number){
        const rideId = UUID.create();
        const status = "requested";
        const date = new Date();
        return new Ride(rideId.getValue(), passengerId, fromLat, fromLong, toLat, toLong, status, date, 0, 0);
    }

    getRideId(){
        return this.rideId.getValue();
    }

    getPassengerId(){
        return this.passengerId.getValue();
    }

    getFrom(){
        return this.from;
    }

    getTo(){
        return this.to;
    }

    getStatus(){
        return this.status.value;
    }

    getDate(){
        return this.date
    }

    getDriverId(){
        return this.driverId?.getValue() || "";
    }

    accepted(driverId: string){
        this.driverId = new UUID(driverId);
        this.status.accept();
    }

    start(){
        this.status.start();
    }

    setStatus(status: RideStatus){
        this.status = status;
    }

    calculateDistance (positions: Position[]) {
		let distance = 0;
		for (const [index, position] of positions.entries()) {
			const nextPosition = positions[index + 1];
			if (!nextPosition) continue;
			distance += DistanceCalculator.calculate(position.getCoord(), nextPosition.getCoord());
		}
		this.distance = distance;
	}

    finish(){
        if(this.status.value !== "in_progress") throw new Error("Invalid status");
        this.status.finish();
        this.fare = this.distance * 2.1;
    }

    getDistance(){
        return this.distance;
    }

    getFare(){
        return this.fare;
    }
}