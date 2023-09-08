import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { NextPage } from 'next';
import axios from "axios";
import { useRouter } from 'next/router';

const Login: NextPage = () => {
    const { data: session } = useSession();
    const router = useRouter();

    if (session?.user) {
        router.push("/home");
    }

    return (
        <>
        </>
    );
};

export default Login;