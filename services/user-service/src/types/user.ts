export interface User {
    id: string;
    email: string;
    userName: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserInput {
    email: string;
    userName: string;
}