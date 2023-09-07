import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { Technology } from "../entity/Technology"
import { UserTechnology } from "../entity/UserTechnology"
import { Event } from "../entity/Event"
import { Reservation } from "../entity/Reservation"
import { isThisTypeNode } from "typescript"

export class UserController {

    private userRepository = AppDataSource.getRepository(User)
    private technologyRepository = AppDataSource.getRepository(Technology)
    private userTechnologyRepository = AppDataSource.getRepository(UserTechnology)
    private eventRepository = AppDataSource.getRepository(Event)

    async getProfile(request: Request, response: Response, next: NextFunction) {
        const userToken = request.params.token
        const user = await this.userRepository.findOne({
            relations: ['user_technologies', 'user_technologies.technology'],
            where: { token: userToken },
        });
        if(!user) {
            response.status(404).send({message: "Not Found"})
            return
        }

        const technologies = new Array()
        user.user_technologies?.forEach((user_tech: UserTechnology) => {
            if(user_tech?.technology !== null) {
                technologies.push(user_tech.technology?.name)
            }
        })

        const res = {
            id: user.id,
            name: user.name,
            email: user.email,
            department: user.department,
            technologies: technologies,
            created_at: user.created_at,
            edit_at: user.edit_at
        }

        response.status(200).send(res)

        return
    }

    async createUser(request: Request, response: Response, next: NextFunction) {
        const {name, email, department, token, technologies} = request.body
        if (!name || !email || !department || !token) {
            response.status(400).send({message: "Bad Request"})
            return
        }

        const find_user = await this.userRepository.findOne({
            where: { email: email },
            });
        if(find_user) {
            response.status(409).send({message: "Conflict"})
            return
        }

        const user = new User()
        user.name = name
        user.email = email
        user.department = department
        user.token = token
        await this.userRepository.save(user)

        technologies.forEach(async (technologyName: string) => {
            const find_tech = await this.technologyRepository.findOne({
                where: { name: technologyName },
            });

            if(find_tech !== null) {
                const _technology = new Technology()
                _technology.id = find_tech.id
                _technology.name  = find_tech.name

                const user_tech = new UserTechnology()
                user_tech.user = user
                user_tech.technology = _technology

                await this.userTechnologyRepository.save(user_tech)
            }
        })

        const savedUser: User = await this.userRepository.findOne({
            relations: ['user_technologies', 'user_technologies.technology'],
            where: { id: user.id },
        });

        const savedTechnologyNames: string[] = new Array()
        if(savedUser.user_technologies) {
            savedUser.user_technologies.forEach((user_tech: UserTechnology) => {
                if(user_tech.technology) {
                    savedTechnologyNames.push(user_tech.technology.name)
                }
            })
        }

        const res = {
            name: savedUser.name,
            email: savedUser.email,
            department: savedUser.department,
            token: savedUser.token,
            technologies: savedTechnologyNames
        }

        response.status(201).send(res)
        return
    }

    async updateProfile(request: Request, response: Response, next: NextFunction) {
        const userToken = request.params.token
        const {name, email, department, technologies} = request.body
        if (!name || !email || !department) {
            response.status(400).send({message: "Bad Request"})
            return
        }

        const user = await this.userRepository.findOne({
            relations: ['user_technologies', 'user_technologies.technology'],
            where: { token: userToken },
        });

        if (!user) {
            response.status(404).send({message: "Not Found"})
            return
        }

        user.user_technologies?.forEach(async (user_tech) => {
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
        technologies.forEach(async (technologyName: string) => {
            const find_tech = await this.technologyRepository.findOne({
                where: { name: technologyName },
            });

            if(find_tech !== null) {
                const _technology = new Technology()
                _technology.id = find_tech.id
                _technology.name = find_tech.name

                const user_tech = new UserTechnology()
                user_tech.user = user
                user_tech.technology = _technology

                await this.userTechnologyRepository.save(user_tech)
            }
        })
        await this.userRepository.save(user)

        const updatedUser = await this.userRepository.findOne({
            relations: ['user_technologies', 'user_technologies.technology'],
            where: { token: userToken },
        });

        const updatedTechnologyNames = new Array()
        updatedUser.user_technologies.forEach((user_tech) => {
            if(user_tech.technology) {
                updatedTechnologyNames.push(user_tech.technology.name)
            }
        })

        const res = {
            name: updatedUser.name,
            email: updatedUser.email,
            department: updatedUser.department,
            technologies: updatedTechnologyNames
        }

        response.status(200).send(res)
        return
    }

    async getUserApplyingEvent(request: Request, response: Response, next: NextFunction) {
        const event_id = parseInt(request.params.id)
        const event = await this.eventRepository.findOne({
            relations: ['reservations', 'reservations.user'],
            where: { id: event_id },
        });

        if(event === null) {
            response.status(404).send({message: "NotFound"})
            return
        }

        const reservation_users: User[] = []
        if(event.reservations !== undefined) {
            event.reservations.forEach((reservation: Reservation) => {
                if(reservation.user !== undefined) {
                    reservation_users.push(reservation.user)
                }
            })
        }

        const res = {
            id: event.id,
            name: event.name,
            users: reservation_users,
            start_time: event.start_time,
            end_time: event.end_time,
            location: event.location,
            description: event.description,
            limitation: event.limitation,
            record_url: event.record_url,
            google_calender_event_id: event.google_calender_event_id,
            created_at: event.created_at,
            edit_at: event.edit_at
        }

        response.status(200).send(res)
        return
    }

    async checkUserByMail(request: Request, response: Response, next: NextFunction) {
        const email: string = request.body.email;
        if(!email) {
            response.status(404).send({message: "NotFound"})
            return
        }
        const user = await this.userRepository.findOne({
            where: { email: email },
            });

        const user_exist = (user!==null);

        return user_exist
    }
}