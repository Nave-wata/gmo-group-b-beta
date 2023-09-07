import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Event } from "./entity/Event"
import { Technology } from "./entity/Technology"
import { EventSpeaker } from "./entity/EventSpeaker"
import { EventTechnology } from "./entity/EventTechnology"
import { Reservation } from "./entity/Reservation"
import { UserTechnology } from "./entity/UserTechnology"
import { Init1693976725289 } from "./migration/1693976725289-init"
import { InitialSchema1694004495976 } from "./migration/1694004495976-InitialSchema"
import { InitialSchema1694006459151 } from "./migration/1694006459151-InitialSchema"

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: "gmo_intern_alpha_db",
    port: 3306,
    username: "root",
    password: "rootpass",
    database: "main",
    synchronize: true,
    logging: false,
    entities: [User, Event, Technology, EventSpeaker, EventTechnology, Reservation, UserTechnology],
    migrations: [Init1693976725289, InitialSchema1694004495976, InitialSchema1694006459151],
    subscribers: [],
})
