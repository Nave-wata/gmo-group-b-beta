import {AppDataSource} from "../data-source"
import {NextFunction, Request, Response} from "express"
import {User} from "../entity/User"
import {Technology} from "../entity/Technology"
import {UserTechnology} from "../entity/UserTechnology"
import {Event} from "../entity/Event"

export class TechnologyController {

    private userRepository = AppDataSource.getRepository(User)
    private technologyRepository = AppDataSource.getRepository(Technology)
    private userTechnologyRepository = AppDataSource.getRepository(UserTechnology)
    private eventRepository = AppDataSource.getRepository(Event)

    async getTagList(request: Request, response: Response, next: NextFunction) {
        const user = await this.technologyRepository.find();

        return user
    }

    async getEventListByTag(request: Request, response: Response, next: NextFunction) {
        const technology_id = request.params.id

        const technology = await this.technologyRepository.findOne({
            relations: ['event_technologies', 'event_technologies.technology'],
            where: {id: Number(technology_id)},
        });
        if (technology == null) {
            return response.status(404).send({message: "Not Found"})
        }

        return technology.event_technologies
    }
}