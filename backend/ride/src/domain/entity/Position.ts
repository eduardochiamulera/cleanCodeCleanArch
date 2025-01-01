import Coord from "../vo/Coord";
import UUID from "../vo/UUID";

export default class Position {

    private positiondId: UUID;
    private rideId: UUID;
    private coord: Coord;
    private date: Date;

    constructor(positionId: string, rideId: string, lat: number, long: number, date: Date){
        this.date = date;
        this.coord = new Coord(lat, long);
        this.rideId = new UUID(rideId);
        this.positiondId = new UUID(positionId);
    }

    setCoord(lat: number, long: number){
        this.coord = new Coord(lat, long);
    }

    getDate(){
        return this.date;
    }

    getCoord(){
        return this.coord;
    }

    getPositionId(){
        return this.positiondId.getValue();
    }

    getRideId(){
        return this.rideId.getValue();
    }

    static create(rideId: string, lat: number, long: number){
        const positionId = UUID.create().getValue();
        const date = new Date();
        return new Position(positionId, rideId, lat, long, date);
    }

}