import {AppDataSource} from "../data-source";
import {Event} from "../entity/Event";
import {NextFunction, Request, Response} from "express"
import {User} from "../entity/User";
import {Technology} from "../entity/Technology";
import {EventTechnology} from "../entity/EventTechnology";
import {UserTechnology} from "../entity/UserTechnology";

export class EventController {

    private eventRepository = AppDataSource.getRepository(Event)
    private userRepository = AppDataSource.getRepository(User)
    private technologyRepository = AppDataSource.getRepository(Technology)
    private eventTechnologyRepository = AppDataSource.getRepository(EventTechnology);


    async createEvent(request: Request, response: Response, next: NextFunction) {
        type RequestBodyType = {
            create_user: number,
            name: string,
            description: string,
            start_time: string,
            end_time: string,
            location: string,
            limitation: number,
            technologies: number[]
        }

        const {
            create_user: createUserId,
            name: name,
            description: description,
            limitation: limitation,
            start_time: startTime,
            end_time: endTime,
            location: location,
            technologies: technologies
        }: RequestBodyType = request.body;

        if (!createUserId || !name || !startTime || !endTime || !location || !technologies) {
            return JSON.stringify({message: "lack data" + createUserId + name + startTime + endTime + location + technologies})
        }

        const createUser = await this.userRepository.findOneBy({
            id: createUserId
        })
        if (!createUser) {
            return JSON.stringify({message: "Specified User ID \"" + createUserId + "\" does not exist"})
        }

        /*let technologyList: Technology[] = []
        technologies.forEach((technology_id) => {
            const technology = await this.technologyRepository.findOneBy({
                id: technology_id
            })
            technologyList.push(technology)
        })*/

        let technologyList: Technology[] = []
        for (const technologyId of technologies) {
            const technology = await this.technologyRepository.findOneBy({
                id: technologyId
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

        for (const event_technology of technologies) {
            await AppDataSource
                .createQueryBuilder()
                .delete()
                .from(EventTechnology)
                .where("technology_id = :id", {id: event_technology})
                .execute()
        }

        event.user = await this.userRepository.findOneBy({
            id: createUserId
        });
        event.name = name;
        event.description = description;
        event.start_time = new Date(startTime);
        event.end_time = new Date(endTime);
        event.location= location;
        event.limitation = limitation;
        // technology
        event.

        event.google_calender_event_id = googleCalenderEventId;




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
}