import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { COLORMODES } from '@gluestack-style/react/lib/typescript/types';
import appStorage from '../../repositories/local_storage';
import KeyStoreData from '../../repositories/local_storage/KeyStoreData';

const COLOR_MODE_KEY = '@color_mode';

const ColorModeContext = createContext({
    colorMode: 'light' as COLORMODES,
    toggleColorMode: () => { },
});

export const ColorModeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemColorScheme = useColorScheme() as COLORMODES;
    const [colorMode, setColorMode] = useState<COLORMODES>(systemColorScheme);

    useEffect(() => {
        const loadColorMode = async () => {
            try {
                const savedColorMode = appStorage.getBool(KeyStoreData.DARK_MODE);
                if (savedColorMode) {
                    setColorMode(savedColorMode ? 'dark' : 'light');
                }
            } catch (error) {
                console.error('Error loading color mode:', error);
            }
        };
        loadColorMode();
    }, []);

    useEffect(() => {
        const saveColorMode = async () => {
            try {
                appStorage.setBool(KeyStoreData.DARK_MODE, colorMode === 'dark');
            } catch (error) {
                console.error('Error saving color mode:', error);
            }
        };
        saveColorMode();
    }, [colorMode]);

    const toggleColorMode = () => {
        setColorMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    return (
        <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
            {children}
        </ColorModeContext.Provider>
    );
};

export const useAppColorMode = () => useContext(ColorModeContext);
