import { withAuth } from "next-auth/middleware";
import { isset } from "./utils/isType";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => {
            if (isset(token)) return true;
            return false;
        },
    },
    pages: {
        signIn: "/login",
    },
});

export const config = {
    matcher: ["/event/:path*", "/home:path*", "/profile/:path*", "/"],
};
