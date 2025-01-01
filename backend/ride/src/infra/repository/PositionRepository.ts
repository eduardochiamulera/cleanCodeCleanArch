import Position from "../../domain/entity/Position";
import { DatabaseConnection } from "../database/DatabaseConnection";
import { inject } from "../di/DI";

export default interface PositionRepository {
    savePosition(position: Position): Promise<void>;
    getPositionsByRideId(rideId: string): Promise<Position[]>;
}

export class PositionRepositoryDatabase implements PositionRepository {
    @inject("databaseConnection")
	connection?: DatabaseConnection;
    
    async savePosition(position: Position): Promise<void> {
        await this.connection?.query(`insert into ccca.position (position_id, ride_id, lat, long, date) 
            values ($1, $2, $3, $4, $5)`, 
			[position.getPositionId(), position.getRideId(), position.getCoord().getLat(), position.getCoord().getLong(), position.getDate()]);
    }
    
    async getPositionsByRideId(rideId: string): Promise<Position[]> {
        const positionsData = await this.connection?.query("select * from ccca.position where ride_id = $1", [rideId]);
        const positions: Position[] = [];
        for(const positionData of positionsData){
            positions.push(new Position(positionData.position_id, positionData.ride_id, parseFloat(positionData.lat), parseFloat(positionData.long), positionData.date));
        }
        return positions;
    }
}