export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = {
    // Fetch all items from the database
    getItems: async () => {
        const response = await fetch(`${API_BASE_URL}/items/`);
        if (!response.ok) throw new Error("Failed to fetch items");
        return response.json();
    },

    // Save a new item (Task, Idea, or Payment)
    createItem: async (item: any) => {
        const response = await fetch(`${API_BASE_URL}/items/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
        });
        if (!response.ok) throw new Error("Failed to create item");
        return response.json();
    },

    // Toggle the completed state of an item
    toggleItem: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/items/${id}/toggle`, {
            method: "PATCH",
        });
        if (!response.ok) throw new Error("Failed to toggle item state");
        return response.json();
    },

    // Delete an item permanently
    deleteItem: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete item");
        return response.json();
    },
};
