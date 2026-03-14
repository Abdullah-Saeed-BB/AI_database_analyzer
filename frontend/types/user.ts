export default interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    last_login_at?: string;
}