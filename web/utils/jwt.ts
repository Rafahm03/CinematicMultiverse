// utils/jwt.ts
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    sub: string;
    iat: number;
    exp: number;
    roles?: string[];
}

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error("Fallo al decodificar el token:", error);
        return null;
    }
};

export const userHasRole = (token: string | null, role: string): boolean => {
    if (!token) return false;
    const decoded = decodeToken(token);
    return decoded?.roles?.includes(role) || false;
};