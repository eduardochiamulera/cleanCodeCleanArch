import Logger from "../../infra/logger/Logger";
import Mediator from "../../infra/mediator/Mediator";
import RideCompletedEvent from "../event/RideCompletedEvent";
import DistanceCalculator from "../service/DistanceCalculator";
import Coord from "../vo/Coord";
import RideStatus, { RideStatusFactory } from "../vo/RideStatus";
import UUID from "../vo/UUID";
import Position from "./Position";

//Observer
export default class Ride extends Mediator {
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
        super();
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
        const distance = 0;
        const fare = 0;
        return new Ride(rideId.getValue(), passengerId, fromLat, fromLong, toLat, toLong, status, date, fare, distance);
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

    finish(positions: Position[]){
        if(this.status.value !== "in_progress") throw new Error("Invalid status");
        const distance = DistanceCalculator.calculateByPositions(positions);
        this.fare = distance * 2.1;
        this.distance = distance;
        this.status.finish();
        const event = new RideCompletedEvent(this.getRideId(), this.getFare());
        this.notify(RideCompletedEvent.eventName, event);
    }

    getDistance(){
        return this.distance;
    }

    getFare(){
        return this.fare;
    }
}