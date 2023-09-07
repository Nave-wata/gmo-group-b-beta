import express from "express"
import bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { Reservation } from "./entity/Reservation"

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
                res.setHeader("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    app.options('*', (req, res) => {
        res.sendStatus(200);
    })

    // setup express app here
    // ...

    // start express server
    app.listen(40000)

    // insert new users for test
    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         firstName: "Timber",
    //         lastName: "Saw",
    //         age: 27
    //     })
    // )

    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         firstName: "Phantom",
    //         lastName: "Assassin",
    //         age: 24
    //     })
    // )

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")

}).catch(error => console.log(error))
