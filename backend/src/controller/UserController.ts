import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { Technology } from "../entity/Technology"
import { UserTechnology } from "../entity/UserTechnology"

export class UserController {

    private userRepository = AppDataSource.getRepository(User)
    private technologyRepository = AppDataSource.getRepository(Technology)
    private userTechnologyRepository = AppDataSource.getRepository(UserTechnology)

    async getProfile(request: Request, response: Response, next: NextFunction) {
        const user_id = parseInt(request.params.id)
        const user = await this.userRepository.findOne({
            relations: ['user_technologies', 'user_technologies.technology'],
            where: { id: user_id },
            });
        if(!user) {
            return response.status(404).send({message: "Not Found"})
        }

        // TODO: 型の確認
        const technologies:string[] = []
        user.user_technologies?.forEach((user_tech) => {
            if(user_tech.technology !== null) {
                technologies.push(user_tech.technology!.name)
            }
        })

        const res = {
            id: user.id,
            name: user.name,
            email: user.email,
            technologies: technologies,
            created_at: user.created_at,
            edit_at: user.edit_at
        }

        return response.status(200).send(res)
        
    }

    async createUser(request: Request, response: Response, next: NextFunction) {
        type RequestBodyType = {
            name: string,
            email: string,
            department: string,
            technologies: number[]
        }

        const {name, email, department, technologies}:RequestBodyType = request.body
        if (!name || !email || !department || technologies.length === 0) {
            return JSON.stringify({message: "lack data"})
        }

        const user = new User()
        user.name = name
        user.email = email
        user.department = department
        technologies.forEach(async (technology) => {
            const find_tech = await this.technologyRepository.findOne({
                where: { id: technology },
                });

            const _technology = new Technology()
            _technology.id = find_tech.id
            _technology.name = find_tech.name

            const user_tech = new UserTechnology()
            user_tech.user = user
            user_tech.technology = _technology

            this.userTechnologyRepository.save(user_tech)
        })
        
        this.userRepository.save(user)
        return "success"
    }
    
    async updateProfile(request: Request, response: Response, next: NextFunction) {
        const user_id = parseInt(request.params.id)
        const {name, email, department, technologies} = request.body
        if (!name) return JSON.stringify({message: "name"})
        if (!email) return JSON.stringify({message: "email"})
        if (!department) return JSON.stringify({message: "department"})
        if (technologies.length === 0) return JSON.stringify({message: "technologies"})

        const user: User = await this.userRepository.findOne({
            relations: ['user_technologies', 'user_technologies.technology'],
            where: { id: user_id },
            });

        user.user_technologies.forEach(async (user_tech) => {
            await AppDataSource
                .createQueryBuilder()
                .delete()
                .from(UserTechnology)
                .where("id = :id", { id: user_tech.id })
                .execute()
        })

        user.name = name
        user.email = email
        user.department = department
        user.user_technologies = new Array()
        technologies.forEach(async (technology) => {
            const find_tech = await this.technologyRepository.findOne({
                where: { id: parseInt(technology) },
                });
            
            const _technology = new Technology()
            _technology.id = find_tech.id
            _technology.name = find_tech.name

            const user_tech = new UserTechnology()
            user_tech.user = user
            user_tech.technology = _technology

            this.userTechnologyRepository.save(user_tech)
            user.user_technologies.push(user_tech)
        })

        this.userRepository.save(user)
        return "success"
    }
}