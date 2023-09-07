import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Event } from "./entity/Event"
import { Technology } from "./entity/Technology"
import { Init1693976725289 } from "./migration/1693976725289-init"

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: "gmo_intern_alpha_db",
    port: 3306,
    username: "root",
    password: "rootpass",
    database: "main",
    synchronize: true,
    logging: false,
    entities: [User, Event, Technology],
    migrations: [Init1693976725289],
    subscribers: [],
})
