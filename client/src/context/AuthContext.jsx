import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './AuthContextValue';
import { apiFetch } from '../lib/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const restoreSession = async () => {
            try {
                const response = await apiFetch('auth/session');
                const data = await response.json();
                if (response.status !== 401 && !response.ok) {
                    throw new Error(data.message || 'Unable to restore your session.');
                }
                if (active && response.ok) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Unable to restore session:', error);
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };
        restoreSession();
        return () => {
            active = false;
        };
    }, []);

    const login = useCallback((userData) => {
        setUser(userData);
    }, []);

    const logout = useCallback(async () => {
        const response = await apiFetch('auth/logout', { method: 'POST' });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Unable to sign out.');
        }
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
