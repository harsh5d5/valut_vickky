export type Category = 'Task' | 'Idea' | 'Payment';

export interface VaultItem {
    id: number;
    title: string;
    description: string;
    category: Category;
    date: string;
    is_completed: boolean;
}
