import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkNetworkConnection, subscribeToNetworkChanges } from '../utils/networkUtils';

interface NetworkContextType {
    isConnected: boolean;
    type: string;
    isInternetReachable: boolean | null;
}

const NetworkContext = createContext<NetworkContextType>({
    isConnected: true,
    type: 'unknown',
    isInternetReachable: null,
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [networkState, setNetworkState] = useState<NetworkContextType>({
        isConnected: true,
        type: 'unknown',
        isInternetReachable: null,
    });

    useEffect(() => {
        // Kiểm tra trạng thái mạng ban đầu
        const checkInitialNetwork = async () => {
            const state = await checkNetworkConnection();
            setNetworkState(state);
        };
        checkInitialNetwork();

        // Lắng nghe sự thay đổi trạng thái mạng
        const unsubscribe = subscribeToNetworkChanges((state) => {
            setNetworkState(state);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <NetworkContext.Provider value={networkState}>
            {children}
        </NetworkContext.Provider>
    );
}; 