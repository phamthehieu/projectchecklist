import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { StyleSheet, View, Image, PanResponder, Modal, Dimensions } from "react-native";
import Svg, { Circle, Defs, FeDropShadow, Filter, G, Path, Text } from "react-native-svg";
import ViewShot from "react-native-view-shot";
import FooterComponent from "./components/FooterComponent";
import ColorOptionComponent from "./components/ColorOptionComponent";
import HeaderEditImageComponent from "./components/HeaderEditImageComponent";
import ImagePicker from "react-native-image-crop-picker";
import { CopyIcon, RefreshCcw, ScanSearch, Trash2 } from "lucide-react-native";
import SampleDrawingComponent from "./components/SampleDrawingComponent";
import { useAppColors } from "../../../hooks/useAppColors";
import { useTranslation } from "react-i18next";
// import { CopyIcon, DeleteIcon, ReziseIcon, TrashIcon, XoayIcon } from "../resources/image";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

interface SelectedElement {
    startAngle: number;
    startX: number;
    startY: number;
    startRotation: number;
    initialDistance?: number;
    initialSize?: number;
    size: number;
    id: number;
    element: JSX.Element;
    position: { x: number; y: number };
    rotation: number;
    isVisible: boolean;
    isInteracting: boolean;
    color: string;
}

const EditImage = ({ visible, imageEdit, onBack }: any) => {
    const viewShotRef = useRef<any>(null);
    const colors = useAppColors();
    const { t } = useTranslation();

    const [drawings, setDrawings] = useState<any[]>([]);
    const [option, setOption] = useState(0);
    const [colorDraw, setColorDraw] = useState("#FF3B30");
    const [isErasing, setIsErasing] = useState(false);
    const [colorChart, setColorChart] = useState(false);
    const [showIcon, setShowIcon] = useState(false)

    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const isErasingRef = useRef(isErasing);
    const colorDrawRef = useRef(colorDraw);

    const [colorIcon, setColorIcon] = useState("#FF3B30");

    const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
    const [aspectRatio, setAspectRatio] = useState(1);

    const lastUpdateTime = useRef(0);
    const FRAME_RATE = 1000 / 120;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                setDrawings(prev => [...prev, { path: [{ x: locationX, y: locationY }], color: colorDrawRef.current }]);
            },

            onPanResponderMove: (evt, gestureState) => {
                const { locationX, locationY } = evt.nativeEvent;
                setDrawings((prev) => {
                    if (prev.length === 0) return prev;

                    if (isErasingRef.current) {
                        return prev.filter((drawing) =>
                            !drawing.path.some((point: { x: number; y: number }) =>
                                Math.hypot(point.x - locationX, point.y - locationY) < 10
                            )
                        );
                    } else {
                        const updatedDrawings = [...prev];
                        if (!Array.isArray(updatedDrawings[updatedDrawings.length - 1].path)) {
                            updatedDrawings[updatedDrawings.length - 1].path = [];
                        }
                        updatedDrawings[updatedDrawings.length - 1].path.push({ x: locationX, y: locationY });
                        return updatedDrawings;
                    }
                });
            }

        })
    ).current;

    const openImageCropper = async () => {
        try {
            const croppedImage = await ImagePicker.openCropper({
                path: capturedImage || imageEdit?.url,
                width: 120,
                height: 120,
                cropping: true,
                mediaType: "photo",
                cropperToolbarTitle: "Chỉnh sửa ảnh",
                cropperToolbarColor: "#000000",
                cropperToolbarWidgetColor: "#FFFFFF",
                freeStyleCropEnabled: true,
                showCropGuidelines: false,
                showCropFrame: false,
            });
            setCapturedImage(croppedImage.path);
        } catch (error) {
            console.error("Lỗi khi cắt ảnh:", error);
        }
    };

    useEffect(() => {
        isErasingRef.current = isErasing;
    }, [isErasing]);

    useEffect(() => {
        colorDrawRef.current = colorDraw;
    }, [colorDraw]);

    const changeDrawColor = (newColor: string) => {
        if (option == 1) {
            setColorDraw(newColor);
            setColorChart(false)
        } else if (option == 2) {
            setColorIcon(newColor);
            setColorChart(false)
        }

    };

    const captureImage = async () => {
        if (viewShotRef.current) {
            try {
                setSelectedElements(prev =>
                    prev.map(item => ({ ...item, isVisible: false }))
                );
                const uri = await viewShotRef.current.capture();
                setCapturedImage(uri);
                setOption(0)
                setSelectedElements([])
                setColorDraw("#FF3B30")
            } catch (error) {
                console.error("Lỗi khi chụp ảnh:", error);
            }
        }
    };

    const stopInteracting = useCallback((id: number) => {
        setSelectedElements(prev =>
            prev.map(item =>
                item.id === id ? { ...item, isInteracting: false } : item
            )
        );

        const timeoutId = setTimeout(() => {
            setSelectedElements(prev =>
                prev.map(item =>
                    item.id === id && !item.isInteracting ? { ...item, isVisible: false } : item
                )
            );
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, []);

    const addElementToSvg = useCallback((element: JSX.Element) => {
        setShowIcon(false)
        const newItem = {
            id: selectedElements.length,
            element,
            position: { x: 150, y: 150 },
            rotation: 0,
            startX: 0,
            startY: 0,
            startRotation: 0,
            startAngle: 0,
            size: 50,
            isVisible: true,
            isInteracting: false,
            color: colorDraw
        };

        setSelectedElements(prev => [...prev, newItem]);

        const timeoutId = setTimeout(() => {
            setSelectedElements(prev =>
                prev.map(item =>
                    item.id === newItem.id && !item.isInteracting ? { ...item, isVisible: false } : item
                )
            );
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [selectedElements.length, colorDraw]);

    const moveElement = useCallback((id: number, dx: number, dy: number) => {
        const now = Date.now();
        if (now - lastUpdateTime.current < FRAME_RATE) {
            return;
        }
        lastUpdateTime.current = now;

        setSelectedElements(prev => {
            const newElements = [...prev];
            const index = newElements.findIndex(item => item.id === id);
            if (index !== -1) {
                newElements[index] = {
                    ...newElements[index],
                    position: {
                        x: newElements[index].position.x + dx,
                        y: newElements[index].position.y + dy
                    },
                    isVisible: true,
                    isInteracting: true
                };
            }
            return newElements;
        });
    }, []);

    const createPanResponder = useCallback((id: number) =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                requestAnimationFrame(() => {
                    moveElement(id, gestureState.dx, gestureState.dy);
                });
            },
            onPanResponderRelease: () => {
                stopInteracting(id);
            }
        }), [moveElement]);

    const createResizePanResponder = (id: number) =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                if (!evt.nativeEvent) return; // Kiểm tra nếu sự kiện bị lỗi

                const { pageX, pageY } = evt.nativeEvent || {};
                if (pageX == null || pageY == null) return; // Tránh lỗi truy cập null

                setSelectedElements(prev =>
                    prev.map(item => {
                        if (item.id !== id) return item;

                        const centerX = item.position.x;
                        const centerY = item.position.y;
                        const initialDistance = Math.hypot(pageX - centerX, pageY - centerY);

                        return {
                            ...item,
                            initialDistance,
                            initialSize: item.size || 50,
                        };
                    })
                );
            },
            onPanResponderMove: (evt, gestureState) => {
                if (!evt.nativeEvent) return;

                const { pageX, pageY } = evt.nativeEvent || {};
                if (pageX == null || pageY == null) return; // Tránh lỗi

                setSelectedElements(prev =>
                    prev.map(item => {
                        if (item.id !== id) return item;

                        const centerX = item.position.x;
                        const centerY = item.position.y;

                        const currentDistance = Math.hypot(pageX - centerX, pageY - centerY);

                        const scaleFactor = currentDistance / (item.initialDistance ?? 1);

                        return {
                            ...item,
                            size: Math.max(20, Math.min(200, (item.initialSize || 50) * scaleFactor)),
                        };
                    })
                );
            },
            onPanResponderRelease: () => {
                stopInteracting(id);
            }
        });

    const createRotatePanResponder = (id: number) =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                if (!evt.nativeEvent) return;

                const { pageX, pageY } = evt.nativeEvent || {};
                if (pageX == null || pageY == null) return;

                setSelectedElements(prev =>
                    prev.map(item => {
                        if (item.id !== id) return item;

                        const centerX = item.position.x;
                        const centerY = item.position.y;
                        const initialAngle = Math.atan2(pageY - centerY, pageX - centerX) * (180 / Math.PI);

                        return {
                            ...item,
                            startRotation: item.rotation || 0,
                            startAngle: initialAngle,
                        };
                    })
                );
            },
            onPanResponderMove: (evt, gestureState) => {
                if (!evt.nativeEvent) return;

                const { pageX, pageY } = evt.nativeEvent || {};
                if (pageX == null || pageY == null) return;

                setSelectedElements(prev =>
                    prev.map(item => {
                        if (item.id !== id) return item;

                        const centerX = item.position.x;
                        const centerY = item.position.y;

                        const currentAngle = Math.atan2(pageY - centerY, pageX - centerX) * (180 / Math.PI);
                        const angleDelta = currentAngle - item.startAngle;

                        return {
                            ...item,
                            rotation: item.startRotation + angleDelta,
                        };
                    })
                );
            },
            onPanResponderRelease: () => {
                stopInteracting(id);
            }
        });

    const getTransform = useCallback((item: SelectedElement) => {
        return `translate(${Math.round(item.position.x)}, ${Math.round(item.position.y)}) rotate(${item.rotation || 0}) scale(${item.size / 50})`;
    }, []);

    useEffect(() => {
        const uri = capturedImage || imageEdit?.url;
        if (!uri) return;

        Image.getSize(uri,
            (w, h) => {
                const newRatio = w / h;
                if (newRatio !== aspectRatio) {
                    setAspectRatio(newRatio);
                }
            },
            (err) => console.warn('Không lấy được kích thước ảnh:', err)
        );
    }, [capturedImage, imageEdit?.url, aspectRatio]);

    const dynamicStyle = {
        width: screenWidth,
        aspectRatio: aspectRatio,
        // width:height = screenWidth : (screenWidth / aspectRatio)
    };

    return (
        <>
            <Modal visible={visible} animationType="slide" style={{ backgroundColor: colors.background.primary }}>
                <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
                    <HeaderEditImageComponent
                        onBack={() => {
                            imageEdit.url = capturedImage || imageEdit.url;
                            onBack(imageEdit);
                        }}
                        onCancel={() => {
                            setDrawings([]);
                            setOption(0);
                            setSelectedElements([]);
                            setShowIcon(false);
                            setColorChart(false)
                            setColorDraw("#FF3B30")
                            setColorIcon("#FF3B30")
                        }}
                        captureImage={captureImage}
                        option={option}
                        setDrawings={() => setDrawings([])}
                        setOption={(value) => setOption(value)}
                    />
                    <ViewShot ref={viewShotRef} style={[styles.viewShot, dynamicStyle]} options={{ format: "png", quality: 1 }}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: capturedImage || imageEdit?.url }} style={[styles.image, dynamicStyle]} resizeMode="contain" alt="avatar" />
                            <View style={[styles.drawingArea, dynamicStyle]} {...panResponder.panHandlers}>
                                <Svg style={[styles.svgContainer, dynamicStyle]}>
                                    {option == 1 &&
                                        <>
                                            {drawings.map((drawing, index) => (
                                                <Path
                                                    key={index}
                                                    d={getPathFromDots(drawing)}
                                                    fill="none"
                                                    stroke={drawing.color}
                                                    strokeWidth={2}
                                                />
                                            ))}
                                        </>
                                    }

                                    {selectedElements.map((item, index) => {
                                        const panResponder = createPanResponder(item.id);
                                        const transform = getTransform(item);
                                        return (
                                            <G
                                                key={index}
                                                transform={transform}
                                                {...panResponder.panHandlers}
                                            >
                                                <G>
                                                    {item.isVisible && (
                                                        <Path
                                                            d="M 0 0 L 100 0 L 100 100 L 0 100 Z"
                                                            fill="#FFFFFF00"
                                                            stroke="#007AFF"
                                                            strokeWidth={1}
                                                        />
                                                    )}
                                                    <G transform="translate(75,75)">
                                                        <G transform="translate(-75,-75)">
                                                            {item.element}
                                                        </G>
                                                    </G>
                                                    {item.isVisible && (
                                                        <>
                                                            <G transform="translate(-14, -14)">
                                                                <Circle
                                                                    cx={16}
                                                                    cy={16}
                                                                    r={16}
                                                                    fill="yellow"
                                                                    onPressIn={() => setSelectedElements(prev => prev.filter(el => el.id !== item.id))}
                                                                />
                                                                <G transform="translate(6, 6)">
                                                                    <Trash2 width={20} height={20} />
                                                                </G>
                                                            </G>


                                                            <G
                                                                transform="translate(84, -14)"
                                                                onPress={() => {
                                                                    setSelectedElements(prev => [
                                                                        ...prev,
                                                                        { ...item, id: prev.length },
                                                                    ]);
                                                                }}
                                                            >
                                                                <Circle cx={16} cy={16} r={16} fill="yellow" />
                                                                <G transform="translate(6, 6)">
                                                                    <CopyIcon width={20} height={20} />
                                                                </G>
                                                            </G>

                                                            <G
                                                                transform="translate(84, 84)"
                                                                {...createRotatePanResponder(item.id).panHandlers}
                                                            >
                                                                <Circle cx={16} cy={16} r={16} fill="yellow" />
                                                                <G transform="translate(6, 6)">
                                                                    <RefreshCcw width={20} height={20} />
                                                                </G>
                                                            </G>

                                                            <G
                                                                transform="translate(84, -14)"
                                                                onPress={() => {
                                                                    setSelectedElements(prev => [
                                                                        ...prev,
                                                                        { ...item, id: prev.length },
                                                                    ]);
                                                                }}
                                                            >
                                                                <Circle cx={16} cy={16} r={16} fill="yellow" onPressIn={() => {
                                                                    const newId = selectedElements.length + 1;

                                                                    setSelectedElements(prev => [
                                                                        ...prev,
                                                                        {
                                                                            ...item,
                                                                            id: newId,
                                                                            position: {
                                                                                x: item.position.x + 30,
                                                                                y: item.position.y + 30
                                                                            },
                                                                            isVisible: true,
                                                                            isInteracting: false
                                                                        }
                                                                    ]);

                                                                    setTimeout(() => {
                                                                        setSelectedElements(prev =>
                                                                            prev.map(el =>
                                                                                el.id === newId && !el.isInteracting ? { ...el, isVisible: false } : el
                                                                            )
                                                                        );
                                                                    }, 3000);
                                                                }} />
                                                                <G transform="translate(6, 6)">
                                                                    <CopyIcon width={20} height={20} />
                                                                </G>
                                                            </G>

                                                            <G
                                                                transform="translate(-14, 84)"
                                                                {...createResizePanResponder(item.id).panHandlers}
                                                            >
                                                                <Circle cx={16} cy={16} r={16} fill="yellow" />
                                                                <G transform="translate(6, 6)">
                                                                    <ScanSearch width={20} height={20} />
                                                                </G>
                                                            </G>
                                                        </>
                                                    )}
                                                </G>
                                            </G>
                                        );
                                    })}

                                </Svg>
                            </View>
                        </View>
                    </ViewShot>

                    {colorChart &&
                        <ColorOptionComponent
                            changeDrawColor={(value) => changeDrawColor(value)}
                            colorDraw={colorDraw}
                        />
                    }

                    {showIcon &&
                        <SampleDrawingComponent
                            colorDraw={colorIcon}
                            addElementToSvg={addElementToSvg}
                        />
                    }

                    <FooterComponent
                        colorIcon={colorIcon}
                        showIcon={showIcon}
                        setShowIcon={setShowIcon}
                        openImageCropper={openImageCropper}
                        option={option}
                        setColorChart={(value: boolean) => setColorChart(value)}
                        colorChart={colorChart}
                        isErasing={isErasing}
                        colorDraw={colorDraw}
                        setIsErasing={(value) => setIsErasing(value)}
                        setOption={(value) => setOption(value)}
                        setDrawings={() => setDrawings([])}
                    />


                </View>
            </Modal>
        </>
    );
};

const getPathFromDots = (drawing: any) => {
    if (!drawing || !Array.isArray(drawing.path) || drawing.path.length === 0) {
        return "";
    }
    return drawing.path.reduce((path: any, dot: { x: any; y: any; }, index: number) => {
        return index === 0 ? `M${dot.x},${dot.y}` : `${path} L${dot.x},${dot.y}`;
    }, "");
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    viewShot: {
        width: screenWidth - 44,
        height: screenHeight / 1.3,
        position: "relative",
        alignSelf: 'center',

    },
    imageContainer: {
        width: screenWidth - 44,
        height: screenHeight / 1.3,
        position: "relative",


    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",

    },
    drawingArea: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
    },
    svgContainer: {
        width: screenWidth - 44,
        height: screenHeight / 1.3,
        position: "relative",

    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 8,
    },

});

export default EditImage;
