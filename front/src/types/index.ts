export interface UserEntity {
    email: string;
    accessToken: string;
    refreshToken: string;
}

export interface EventEntity {
    summary: string;
    location: string;
    description: string;
    start: {
        date?: string;
        dateTime?: string;
        timeZone?: string;
    };
    end: {
        date?: string;
        dateTime?: string;
        timeZone?: string;
    };
}
