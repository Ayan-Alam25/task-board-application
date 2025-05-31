export interface User {
    id: string;
    name: string;
    email: string;
}

export type Priority = "high" | "medium" | "low";

export interface Card {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    createdBy: User;
    priority: Priority;
    dueDate: Date;
    assignedTo: User;
}

export interface Column {
    id: string;
    title: string;
    cards: Card[];
}

export interface Board {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    createdBy: User;
    columns: Column[];
}