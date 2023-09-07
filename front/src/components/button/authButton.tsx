"use client";

import { signIn, signOut, useSession } from "next-auth/react";

// ログインボタン
export const LoginButton = () => {
    return (
        <button style={{ marginRight: 10 }} onClick={() => signIn()}>
            Sign in
        </button>
    );
};

// ログアウトボタン
export const LogoutButton = () => {
    return (
        <button style={{ marginRight: 10 }} onClick={() => signOut()}>
            Sign Out
        </button>
    );
};