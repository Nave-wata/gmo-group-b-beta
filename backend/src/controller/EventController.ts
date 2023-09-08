import {AppDataSource} from "../data-source";
import {Event} from "../entity/Event";
import {NextFunction, Request, Response} from "express"
import {User} from "../entity/User";
import {Technology} from "../entity/Technology";
import {EventTechnology} from "../entity/EventTechnology";
import {UserTechnology} from "../entity/UserTechnology";
import {Reservation} from "../entity/Reservation";

export class EventController {

    private eventRepository = AppDataSource.getRepository(Event)
    private userRepository = AppDataSource.getRepository(User)
    private technologyRepository = AppDataSource.getRepository(Technology)
    private eventTechnologyRepository = AppDataSource.getRepository(EventTechnology);
    private reservationRepository = AppDataSource.getRepository(Reservation);


    async createEvent(request: Request, response: Response, next: NextFunction) {
        type RequestBodyType = {
            create_user: string,
            name: string,
            description: string,
            start_time: string,
            end_time: string,
            location: string,
            limitation: number,
            technologies: string[]
        }

        const {
            create_user: createUserToken,
            name: name,
            description: description,
            limitation: limitation,
            start_time: startTime,
            end_time: endTime,
            location: location,
            technologies: technologies
        }: RequestBodyType = request.body;

        if (!createUserToken || !name || !startTime || !endTime || !location || !technologies) {
            return JSON.stringify({message: "lack data" + createUserToken + name + startTime + endTime + location + technologies})
        }

        const createUser = await this.userRepository.findOneBy({
            token: createUserToken
        })
        if (!createUser) {
            return JSON.stringify({message: "Specified User ID \"" + createUserToken + "\" does not exist"})
        }

        /*let technologyList: Technology[] = []
        technologies.forEach((technology_id) => {
            const technology = await this.technologyRepository.findOneBy({
                id: technology_id
            })
            technologyList.push(technology)
        })*/

        let technologyList: Technology[] = []
        for (const technologyName of technologies) {
            const technology = await this.technologyRepository.findOneBy({
                name: technologyName
            })
            if (technology) {
                technologyList.push(technology)
            }
        }


        // eventテーブルに保存
        const event = new Event();
        event.user = createUser;
        event.name = name;
        event.description = description;
        event.start_time = new Date(startTime);
        event.end_time = new Date(endTime);
        event.location = location;
        event.limitation = limitation;
        event.google_calender_event_id = "test";

        await AppDataSource.manager.save(event);

        let eventTechnologyList: EventTechnology[] = []

        // technology_eventテーブルに保存
        for (const temp of technologyList) {
            const technologyEvent = new EventTechnology();
            technologyEvent.event = event;

            technologyEvent.technology = temp;
            eventTechnologyList.push(technologyEvent);
            await AppDataSource.manager.save(technologyEvent);
        }

        return "success"
    }

    async getEventList(request: Request, response: Response, next: NextFunction) {
        const events = await this.eventRepository.find({
            relations: ['user', 'event_technologies', 'event_technologies.technology'],
        });

        response.status(200).send(events);
        return;
    }

    async getEventDetail(request: Request, response: Response, next: NextFunction) {
        const eventId = request.params.id;
        console.log(eventId);
        const event = await this.eventRepository.findOne({
                relations: ['user', 'event_technologies', 'event_technologies.technology'],
                where: {id: parseInt(eventId)},
            }
        );
        if (event == null) {
            response.status(404).send({message: eventId + " is not Found"})
            return;
        }
        response.status(200).send(event);
        return;
    }

    async updateEvent(request: Request, response: Response, next: NextFunction) {
        type RequestBodyType = {
            create_user: number,
            name: string,
            description: string,
            start_time: string,
            end_time: string,
            location: string,
            limitation: number,
            technologies: number[],
            google_calender_event_id: string,
            record_url: string
        }

        const {
            create_user: createUserId,
            name: name,
            description: description,
            start_time: startTime,
            end_time: endTime,
            location: location,
            limitation: limitation,
            technologies: technologies,
            google_calender_event_id: googleCalenderEventId,
            record_url: recordUrl
        }: RequestBodyType = request.body;

        if (!createUserId || !name || !startTime || !endTime || !location || !technologies) {
            JSON.stringify({message: "lack data"});
            return;
        }

        const event = await this.eventRepository.findOne({
            relations: ['user', 'event_technologies', 'event_technologies.technology'],
            where: {id: Number(request.params.id)},
        });

        if (event == null) {
            response.status(404).send({message: request.params.id + " is not Found"});
            return;
        }

        // もともと持っているイベントを削除する
        for (const event_technology of event.event_technologies) {
            await AppDataSource
                .createQueryBuilder()
                .delete()
                .from(EventTechnology)
                .where("technology_id = :id", {id: event_technology.id})
                .execute()
        }

        // Bodyから受け取ったtechnologiesというnumber配列からtechnology_idを取得して、テクノロジーレポジトリからそれを探す
        let technologyList: Technology[] = []
        for (const technologyId of technologies) {
            const technology = await this.technologyRepository.findOneBy({
                id: technologyId
            })
            if (technology) {
                technologyList.push(technology)
            }
        }

        event.user = await this.userRepository.findOneBy({
            id: createUserId
        });
        event.name = name;
        event.description = description;
        event.start_time = new Date(startTime);
        event.end_time = new Date(endTime);
        event.location = location;
        event.limitation = limitation;
        event.record_url = recordUrl;
        event.google_calender_event_id = googleCalenderEventId;

        // technology
        let eventTechnologyList: EventTechnology[] = []

        // technology_eventテーブルに保存
        for (const temp of technologyList) {
            const technologyEvent = new EventTechnology();
            technologyEvent.event = event;

            technologyEvent.technology = temp;
            eventTechnologyList.push(technologyEvent);
            await AppDataSource.manager.save(technologyEvent);
        }

        await this.eventRepository.save(event);

        response.status(200).send(event);
        return;
    }

    async deleteEvent(request: Request, response: Response, next: NextFunction) {
        const eventId = request.params.id;
        console.log(eventId)
        const event = await this.eventRepository.findOne({
                relations: ['user', 'event_technologies', 'event_technologies.technology'],
                where: {id: Number(eventId)},
            }
        );
        if (event == null) {
            response.status(404).send({message: eventId + " is not Found"});
            return;
        } else {
            await this.eventRepository.remove(event);
            response.status(200).send({message: "success"});
            return;
        }
    }

    // made by rei
    async getRemainingSlotsByEvent(request: Request, response: Response, next: NextFunction) {
        const event_id: number = parseInt(request.params.id)
        const event = await this.eventRepository.findOne({
            relations: ['reservations', 'reservations.user'],
            where: {id: event_id},
        });

        let remaining: number | null = null
        if (event?.limitation !== null && event?.limitation !== undefined) {
            const reservationing_count = (event.reservations?.length === undefined) ? 0 : event.reservations.length
            remaining = event?.limitation - reservationing_count
        }
        const res = {
            'remaining': remaining
        }

        response.status(200).send(res)
        return
    }

    // made by rei
    async getEventListByTag(request: Request, response: Response, next: NextFunction) {
        const tag_id: number = parseInt(request.params.id)
        const technology = await this.technologyRepository.findOne({
            relations: ['event_technologies', 'event_technologies.event'],
            where: {id: tag_id},
        });

        if (technology === null) {
            response.status(404).json({message: "Not Found"})
            return
        }

        const eventList: Event[] = []
        technology.event_technologies?.forEach((event_tech: EventTechnology) => {
            if (event_tech.event !== undefined) {
                eventList.push(event_tech.event)
            }
        })

        const res = {
            id: tag_id,
            name: technology.name,
            events: eventList,
            created_at: technology.created_at,
            edit_at: technology.edit_at
        }

        response.status(200).json(res)
        return
    }

    // made by rei
    async applyEvent(request: Request, response: Response, next: NextFunction) {
        const event_id: number = parseInt(request.params.event_id)
        const user_token: string = request.params.user_token
        const event: Event | null = await this.eventRepository.findOne({
            relations: ['reservations', 'reservations.user'],
            where: {id: event_id},
        });
        const user: User | null = await this.userRepository.findOne({
            where: {token: user_token},
        });

        if (event === undefined || event === null || user == undefined || user === null) {
            response.status(404).send({message: "NotFound"})
            return
        }

        let is_applied: Boolean = false
        if (event?.reservations !== undefined) {
            event?.reservations.forEach((reservation) => {
                if (reservation.user !== undefined && reservation.user.token === user_token) {
                    is_applied = true
                }
            });
        }

        if (is_applied) {
            response.status(400).send({message: "BadRequest"})
            return
        }
        const reservation = new Reservation()
        reservation.user = user
        reservation.event = event

        this.reservationRepository.save(reservation)
        response.status(201).send(reservation)
        return
    }
}