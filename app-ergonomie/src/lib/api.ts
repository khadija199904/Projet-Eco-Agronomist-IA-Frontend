const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface User {
    id: number;
    email: string;
    username: string;
    role: string;
    full_name?: string;
    organization_id?: number;
    is_active: boolean;
}

export interface Organization {
    id: number;
    name: string;
    type: string;
    address?: string;
    is_certified?: boolean;
}

export const authAPI = {
    login: async (credentials: URLSearchParams) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: credentials,
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    register: async (data: any) => {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    getMe: async (token: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/users/me`, {
            method: "PATCH", // Actually, in the backend it's PATCH for update, but let's assume we decode token or just use it. 
            // Wait, the backend doesn't have a simple GET /users/me in auth.py? It only has PATCH /users/me for updating! 
            // We will rely on JWT token decoding or return the user during login. 
            // The backend /login only returns access_token. Let's create a utility to decode it later if needed.
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.json();
    }
};

export const organizationAPI = {
    getOrganizations: async () => {
        const res = await fetch(`${API_BASE_URL}/organization/`);
        if (!res.ok) throw new Error("Failed to fetch organizations");
        return res.json(); // Returns array of Organization
    },

    createOrganization: async (data: any) => {
        const res = await fetch(`${API_BASE_URL}/organization/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }
};
export const diagnosticAPI = {
    // Analyse une image de plante via IA
    uploadPlant: async (formData: FormData): Promise<any> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/diagnostic/plant`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Erreur lors du diagnostic plante");
        }
        return response.json();
    },

    // Analyse une image de produit via IA
    uploadProduct: async (formData: FormData): Promise<any> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/diagnostic/product`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Erreur lors du diagnostic produit");
        }
        return response.json();
    },

    // Génère une ordonnance RAG pour un diagnostic existant
    getOrdonnance: async (diagnosticId: number, culture?: string): Promise<any> => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        if (culture) formData.append('culture', culture);

        const response = await fetch(`${API_BASE_URL}/diagnostic/${diagnosticId}/ordonnance`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Erreur lors de la génération de l'ordonnance");
        }
        return response.json();
    },

    // Récupère l'historique des diagnostics
    getHistory: async (type?: string): Promise<any> => {
        const token = localStorage.getItem('token');
        const url = type
            ? `${API_BASE_URL}/diagnostic/history?diag_type=${type}`
            : `${API_BASE_URL}/diagnostic/history`;

        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération de l'historique");
        return response.json();
    },

    // Analyse une image de fraîcheur pour le consommateur (Fresh vs Rotten)
    uploadConsumerDiagnostic: async (formData: FormData): Promise<any> => {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/diagnostic/consume`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({ detail: "Erreur lors du diagnostic fraîcheur" }));
            throw new Error(err.detail || "Erreur lors du diagnostic");
        }
        return response.json();
    }
};

export const productionAPI = {
    // Crée un nouveau lot de récolte
    createLotRecolte: async (data: any): Promise<any> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/production/lot_recolte`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Erreur lors de la création du lot");
        }
        return response.json();
    },

    // Récupère les lots de la ferme de l'utilisateur
    getMyLots: async (): Promise<any> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/production/ma-ferme`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error("Erreur lors de la récupération des lots");
        return response.json();
    },

    // Récupère tous les lots (avec filtre ferme optionnel)
    getLots: async (fermeId?: number): Promise<any> => {
        const token = localStorage.getItem('token');
        const url = fermeId
            ? `${API_BASE_URL}/production/lots?ferme_id=${fermeId}`
            : `${API_BASE_URL}/production/lots`;

        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error("Erreur lors de la récupération des lots");
        return response.json();
    }
};

export const valorisationAPI = {
    // Enregistre l'arrivée d'un lot à la station
    recordReception: async (data: any): Promise<any> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/valorisation/reception`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Erreur lors de l'enregistrement de la réception");
        }
        return response.json();
    },

    // Récupère toutes les réceptions de la station (lots réceptionnés)
    getAllReceptions: async (): Promise<any[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/valorisation/receptions`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) return [];
        return response.json();
    },

    // Récupère les détails de réception pour un lot spécifique
    getReception: async (lotId: number): Promise<any> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/valorisation/reception/${lotId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            console.warn(`[Reception] Lot ${lotId}: HTTP ${response.status}`);
            return null;
        }
        const data = await response.json();
        console.log(`[Reception] Lot ${lotId}:`, data);
        return data;
    }
};
