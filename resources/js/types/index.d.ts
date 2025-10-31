export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    user_type: 'driver' | 'expert' | 'admin';
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
