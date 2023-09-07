import { UserController } from "./controller/UserController"
import { TechnologyController } from "./controller/TechnologyController"

export const Routes = [{
    method: "post",
    route: "/api/user",
    controller: UserController,
    action: "createUser"
}, {
    method: "get",
    route: "/api/user/:id",
    controller: UserController,
    action: "getProfile"
}, {
    method: "patch",
    route: "/api/user/:id",
    controller: UserController,
    action: "updateProfile"
}, {
    method: "get",
    route: "/api/tag",
    controller: TechnologyController,
    action: "getTagList"
}, {
    method: "get",
    route: "/api/tag/:id/event",
    controller: TechnologyController,
    action: "getEventListByTag"
}]
// {
//     method: "post",
//     route: "/api/event",
//     controller: EventController,
//     action: "createEvent"
// }, {
//     method: "get",
//     route: "/api/event",
//     controller: EventController,
//     action: "getEventList"
// }, {
//     method: "get",
//     route: "/api/event/:id",
//     controller: EventController,
//     action: "getEventDetail"
// }, {
//     method: "patch",
//     route: "/api/event/:id",
//     controller: EventController,
//     action: "updateEvent"
// }, {
//     method: "delete",
//     route: "/users/:id",
//     controller: EventController,
//     action: "deleteEvent"
// }]