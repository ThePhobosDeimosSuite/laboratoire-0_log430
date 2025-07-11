const username = "admin"
const password = "123"
const base64 = btoa(`${username}:${password}`);
export const headers = {
    'Authorization': `Basic ${base64}`,
}