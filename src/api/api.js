
const BASE_URL = "https://rickandmortyapi.com/api/character/";

export const api = {
    async getApiInfo(id) {
        try {
            const url = `${BASE_URL}${id}`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP Error. Status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (err) {
            console.error(err);
            return { error: true, status: err.status, message: err.message };
        }
    },

     url(){
        return BASE_URL;
    }
};
