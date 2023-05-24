import {AppDataSource} from "../data-source";
import {Flight} from "../entity/Flight";
import {ArrayContains, Between, Equal, IsNull, MoreThan, Not} from "typeorm";
import {isNull} from "util";

class FlightService {
    private flightRepository = AppDataSource.getRepository(Flight);
    all2 = async () => {
        let flights = await AppDataSource.createQueryBuilder()
            .select("flight")
            .from(Flight, "flight")
            .innerJoinAndSelect("flight.aircraft", "aircraft")
            .innerJoinAndSelect("aircraft.airline", "airline")
            .leftJoinAndSelect("flight.rows", "rows")
            .innerJoinAndSelect("flight.from", "from")
            .innerJoinAndSelect("flight.to", "to")
            .leftJoinAndSelect("rows.class", "class")
            .orderBy("flight.id")
            .getMany()
        return flights
    }

    all = async (queries) => {
        console.log("queries:", queries)
        let startPlus = new Date(queries.start);
        startPlus.setDate(startPlus.getDate() + 1)
        console.log("start:", new Date(queries.start), startPlus, new Date(0))
        return await this.flightRepository.find({
            where: {
                from: (queries.from) ? Equal(parseInt(queries.from)) : Not(IsNull()),
                to: (queries.to) ? Equal(parseInt(queries.to)) : Not(IsNull()),
                start: (queries.start) ? Between(new Date(queries.start), startPlus) : Not(IsNull()),
                rows: {
                    // class: queries.class ? ArrayContains([parseInt(queries.class)]) : Not(IsNull()),
                    class: queries.class ? Equal(parseInt(queries.class)) : Not(IsNull()),
                }
            },
            select: {
                rows: {
                    class: {
                        name: false
                    }
                },
            },
            relations: {
                aircraft: {
                    airline: true
                },
                //rows should not be selected but still have in comparison
                rows: {
                    class: true
                },
                from: true,
                to: true
            }
        })
    }

    save = async (flight) => {
        await this.flightRepository.save(flight);
    }

    update = async (id, flight) => {
        await this.flightRepository.update({id: id}, flight);
    }

    delete = async (id) => {
        await this.flightRepository.delete({id: id});
    }

}

export default new FlightService()
