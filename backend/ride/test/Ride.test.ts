import Ride from "../src/domain/entity/Ride"

test("Deve criar uma corrida", function() {
    const ride = Ride.create("", 1, 2,3,4);
    console.log(ride);
    expect(ride).toBeDefined();
})