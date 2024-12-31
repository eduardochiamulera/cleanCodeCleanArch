import Coord from "../vo/Coord";
import RideStatus, { RideStatusFactory } from "../vo/RideStatus";
import UUID from "../vo/UUID";

export default class Ride{
    private rideId: UUID;
    private from: Coord;
    private to: Coord;
    private passengerId: UUID;
    private status: RideStatus;
    private date: Date;
    private driverId?: UUID;

    constructor(rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date, driverId?: string){
        this.from = new Coord(fromLat, fromLong);
        this.to = new Coord(toLat, toLong);
        this.passengerId = new UUID(passengerId);
        this.rideId = new UUID(rideId);
        this.status = RideStatusFactory.create(status, this);
        this.date = date;
        if(driverId) this.driverId = new UUID(driverId);
    }
    
    static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number){
        const rideId = UUID.create();
        const status = "requested";
        const date = new Date();
        return new Ride(rideId.getValue(), passengerId, fromLat, fromLong, toLat, toLong, status, date);
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
        return this.status;
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
}