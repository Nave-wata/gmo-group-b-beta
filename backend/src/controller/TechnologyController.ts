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

    async createTag(request: Request, response: Response, next: NextFunction) {
        const {name} = request.body;
        if(!name) {
            response.status(400).send({message: "Bad Request"});
            return
        }

        const technology = new Technology();
        technology.name = name

        this.technologyRepository.save(technology)
        response.status(201).send(technology)
        return
    }
}