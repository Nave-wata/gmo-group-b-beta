import { UserController } from "./controller/UserController"
import { TechnologyController } from "./controller/TechnologyController"
import { EventController } from "./controller/EventController"

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
    route: "/api/user/event/:id",
    controller: UserController,
    action: "getUserApplyingEvent"
}, {
    method: "post",
    route: "/api/user/exist",
    controller: UserController,
    action: "checkUserByMail"
}, {
    method: "get",
    route: "/api/tag",
    controller: TechnologyController,
    action: "getTagList"
}, {
    method: "get",
    route: "/api/event/:id/remaining",
    controller: EventController,
    action: "getRemainingSlotsByEvent"
}, {
    method: "get",
    route: "/api/event/tag/:id",
    controller: EventController,
    action: "getEventListByTag"
},{
    method: "post",
    route: "/api/event/:event_id/apply/:user_id",
    controller: EventController,
    action: "applyEvent"
},{
    method: "post",
    route: "/api/event",
    controller: EventController,
    action: "createEvent"
}, {
    method: "get",
    route: "/api/event",
    controller: EventController,
    action: "getEventList"
}, {
    method: "get",
    route: "/api/event/:id",
    controller: EventController,
    action: "getEventDetail"
}, {
    method: "patch",
    route: "/api/event/:id",
    controller: EventController,
    action: "updateEvent"
}, {
    method: "delete",
    route: "/api/event/:id",
    controller: EventController,
    action: "deleteEvent"
}]