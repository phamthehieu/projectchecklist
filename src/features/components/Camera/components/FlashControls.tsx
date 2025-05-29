import { Image } from "@gluestack-ui/themed";
import React from "react";
import { useCallback } from "react";
import { TouchableOpacity } from "react-native";

const FlashControls = React.memo(({ flash, showListFlast, setShowListFlast, onChangeFlash, type }: any) => {
    const getFlashIcon = useCallback((flashValue: number) => {
        if (type != "video") {
            switch (flashValue) {
                case 1: return require('../../../../assets/image/ic_flash_auto_30.png');
                case 2: return require('../../../../assets/image/ic_flash_30.png');
                case 3: return require('../../../../assets/image/ic_flash_off_30.png');
                default: return require('../../../../assets/image/ic_flash_auto_30.png');
            }
        } else {
            switch (flashValue) {
                case 1: return require('../../../../assets/image/ic_flash_off_30.png');
                case 2: return require('../../../../assets/image/ic_flash_30.png');

            }
        }
    }, []);

    const getFlashColor = useCallback((flashValue: number) => {
        return flash === flashValue ? 'yellow' : 'white';
    }, [flash]);

    return (
        <>
            <TouchableOpacity onPress={() => setShowListFlast(!showListFlast)} style={{ top: 5, left: 5 }}>
                <Image
                    source={getFlashIcon(flash)}
                    style={{ width: 30, height: 30, resizeMode: 'cover' }}
                    alt="flash"
                />
            </TouchableOpacity>

            {showListFlast && (
                <>
                    {type != "video" ? (
                        <>
                            {[1, 2, 3].map(flashOption => (
                                <TouchableOpacity key={flashOption} onPress={() => onChangeFlash(flashOption)}>
                                    <Image source={getFlashIcon(flashOption)} style={{ width: 30, height: 30, resizeMode: 'cover', tintColor: getFlashColor(flashOption) }} alt="flash" />
                                </TouchableOpacity>
                            ))}
                        </>
                    ) : (
                        <>
                            {[1, 2].map(flashOption => (
                                <TouchableOpacity key={flashOption} onPress={() => onChangeFlash(flashOption)}>
                                    <Image source={getFlashIcon(flashOption)} style={{ width: 30, height: 30, resizeMode: 'cover', tintColor: getFlashColor(flashOption) }} alt="flash" />
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                </>
            )}
        </>
    );
});

export default FlashControls;
