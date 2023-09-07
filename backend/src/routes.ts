import { UserController } from "./controller/UserController"
import {EventController} from "./controller/EventController";
import {TechnologyController} from "./controller/TechnologyController";

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
    method: "post",
    route: "/api/event",
    controller: EventController,
    action: "createEvent"
}, {
    method: "get",
    route: "/api/user/event/:id",
    controller: UserController,
    action: "getUserApplyingEvent"
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
    action: "updateEvent"
}, {
    method: "delete",
    route: "/users/:id",
    controller: EventController,
    action: "applyEvent"
}]