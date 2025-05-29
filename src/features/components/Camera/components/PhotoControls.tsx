import { SwitchCamera, CircleX } from "lucide-react-native";
import React from "react";

import { TouchableOpacity, Text } from "react-native";

const PhotoControls = React.memo(({ photoHdr, setPhotoHdr, toggleCamera, onClose, colors }: any) => {
    return (
        <>
            <TouchableOpacity onPress={() => setPhotoHdr(!photoHdr)}>
                <Text
                    style={{
                        color: photoHdr ? '#FFD100' : 'white',
                        fontSize: 22,
                        fontWeight: '600',
                        top: 5,
                    }}>
                    HDR
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCamera}>
                <SwitchCamera size={30} color="white" style={{ top: 5, height: 30 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
                <CircleX size={30} color={colors.tailwind.red[500]} style={{ top: 5, height: 30 }} />
            </TouchableOpacity>
        </>
    );
});

export default PhotoControls;
