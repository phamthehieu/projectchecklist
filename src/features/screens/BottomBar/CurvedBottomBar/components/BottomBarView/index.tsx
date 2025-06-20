/* eslint-disable @typescript-eslint/no-shadow */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { ParamListBase } from '@react-navigation/native';
import React, {
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react';
import {
    Dimensions,
    I18nManager,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { scale } from 'react-native-size-scaling';
import { getPathDown } from '../../utils/pathDown';
import { getPathUp } from '../../utils/pathUp';
import { CurvedViewComponent } from '../CurvedView/curvedView';
import type { ICurvedBottomBarRef, NavigatorBottomBarProps } from './model';
import { styles } from './styles';
const { width: maxW } = Dimensions.get('window');

type TabParamList = {
    [key: string]: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const BottomBarComponent = React.forwardRef<
    ICurvedBottomBarRef,
    NavigatorBottomBarProps
>((props, ref) => {
    const {
        type = 'DOWN',
        circlePosition = 'CENTER',
        style,
        width = null,
        height = 65,
        circleWidth = 50,
        bgColor = 'gray',
        initialRouteName,
        tabBar,
        renderCircle,
        borderTopLeftRight = false,
        shadowStyle,
        borderColor = 'gray',
        borderWidth = 0,
    } = props;

    const [itemLeft, setItemLeft] = useState<any[]>([]);
    const [itemRight, setItemRight] = useState<any[]>([]);
    const [maxWidth, setMaxWidth] = useState<number>(width || maxW);
    const [isShow, setIsShow] = useState(true);
    const children = props?.children as any[];
    const orientation = useDeviceOrientation();

    useImperativeHandle(ref, () => {
        return { setVisible };
    });

    const setVisible = (visible: boolean) => {
        setIsShow(visible);
    };

    useEffect(() => {
        const { width: w } = Dimensions.get('window');
        if (!width) {
            setMaxWidth(w);
        }
    }, [orientation, width]);

    const _renderButtonCenter = useCallback(
        (focusedTab: string, navigate: any) => {
            const getTab = children.filter(
                (e: any) =>
                    e?.props?.position === 'CIRCLE' || e?.props?.position === 'CENTER'
            )[0]?.props?.name;

            return renderCircle({
                routeName: getTab,
                selectedTab: focusedTab,
                navigate: (selectTab: string) => {
                    if (selectTab) {
                        navigate(selectTab);
                    }
                },
            });
        },
        [children, renderCircle]
    );

    useEffect(() => {
        const arrLeft: any = children.filter(
            (item) => item?.props?.position === 'LEFT'
        );
        const arrRight: any = children.filter(
            (item) => item?.props?.position === 'RIGHT'
        );

        setItemLeft(arrLeft);
        setItemRight(arrRight);
    }, [children, initialRouteName]);

    const getCircleWidth = useMemo(() => {
        return circleWidth < 50 ? 50 : circleWidth > 60 ? 60 : circleWidth;
    }, [circleWidth]);

    const getTabbarHeight = useMemo(() => {
        return height < 50 ? 50 : height > 90 ? 90 : height;
    }, [height]);

    const d = useMemo(() => {
        return type === 'DOWN'
            ? getPathDown(
                maxWidth,
                getTabbarHeight,
                getCircleWidth,
                borderTopLeftRight,
                !I18nManager.isRTL
                    ? circlePosition
                    : circlePosition === 'LEFT'
                        ? 'RIGHT'
                        : circlePosition === 'RIGHT'
                            ? 'LEFT'
                            : 'CENTER'
            )
            : getPathUp(
                maxWidth,
                getTabbarHeight + 30,
                getCircleWidth,
                borderTopLeftRight,
                !I18nManager.isRTL
                    ? circlePosition
                    : circlePosition === 'LEFT'
                        ? 'RIGHT'
                        : circlePosition === 'RIGHT'
                            ? 'LEFT'
                            : 'CENTER'
            );
    }, [
        borderTopLeftRight,
        circlePosition,
        getCircleWidth,
        getTabbarHeight,
        maxWidth,
        type,
    ]);

    const renderItem = ({ color, routeName, navigate }: any) => {
        return (
            <TouchableOpacity
                key={routeName}
                style={styles.itemTab}
                onPress={() => navigate(routeName)}
            >
                <Text style={{ color: color }}>{routeName}</Text>
            </TouchableOpacity>
        );
    };

    const _renderTabIcon = useCallback(
        (arr: any[], focusedTab: string, navigation: any) => {
            return (
                <View style={[styles.rowLeft, { height: scale(getTabbarHeight) }]}>
                    {arr.map((item: any, index) => {
                        const routeName: string = item?.props?.name;

                        if (tabBar === undefined) {
                            return renderItem({
                                routeName,
                                color: focusedTab === routeName ? 'blue' : 'gray',
                                navigate: navigation.navigate,
                            });
                        }

                        return (
                            <View style={styles.flex1} key={index.toString()}>
                                {tabBar({
                                    routeName,
                                    selectedTab: focusedTab,
                                    navigate: (selectTab: string) => {
                                        if (selectTab !== focusedTab) {
                                            navigation.navigate({
                                                name: routeName,
                                                merge: true,
                                            });
                                        }
                                    },
                                })}
                            </View>
                        );
                    })}
                </View>
            );
        },
        [getTabbarHeight, tabBar]
    );

    const renderPosition = useCallback(
        (props: any) => {
            const { state, navigation } = props;
            const focusedTab = state?.routes[state.index].name;

            if (circlePosition === 'LEFT') {
                return (
                    <>
                        <View style={{ marginLeft: scale(getCircleWidth) / 2 }}>
                            {_renderButtonCenter(focusedTab, navigation.navigate)}
                        </View>
                        {_renderTabIcon(
                            [...itemLeft, ...itemRight],
                            focusedTab,
                            navigation
                        )}
                    </>
                );
            }

            if (circlePosition === 'RIGHT') {
                return (
                    <>
                        {_renderTabIcon(
                            [...itemLeft, ...itemRight],
                            focusedTab,
                            navigation
                        )}
                        <View style={{ marginRight: scale(getCircleWidth) / 2 }}>
                            {_renderButtonCenter(focusedTab, navigation.navigate)}
                        </View>
                    </>
                );
            }

            return (
                <>
                    {_renderTabIcon(itemLeft, focusedTab, navigation)}
                    {_renderButtonCenter(focusedTab, navigation.navigate)}
                    {_renderTabIcon(itemRight, focusedTab, navigation)}
                </>
            );
        },
        [
            _renderButtonCenter,
            _renderTabIcon,
            circlePosition,
            getCircleWidth,
            itemLeft,
            itemRight,
        ]
    );

    const _renderTabContainer = useCallback(
        (props: any) => {
            return (
                <View
                    style={[
                        styles.main,
                        { width: maxWidth },
                        type === 'UP' && styles.top30,
                    ]}
                >
                    {renderPosition(props)}
                </View>
            );
        },
        [maxWidth, renderPosition, type]
    );

    const MyTabBar = useCallback(
        (props: BottomTabBarProps) => {
            if (!isShow) {
                return null;
            }

            return (
                <View style={[styles.container, style]}>
                    <CurvedViewComponent
                        style={shadowStyle}
                        width={maxWidth}
                        height={scale(getTabbarHeight) + (type === 'DOWN' ? 0 : scale(30))}
                        bgColor={bgColor}
                        path={d}
                        borderColor={borderColor}
                        borderWidth={borderWidth}
                    />
                    {_renderTabContainer(props)}
                </View>
            );
        },
        [
            _renderTabContainer,
            bgColor,
            d,
            getTabbarHeight,
            isShow,
            maxWidth,
            shadowStyle,
            style,
            type,
            borderColor,
            borderWidth,
        ]
    );

    const main = useMemo(() => {
        const { type, circlePosition, style, width, height, circleWidth, bgColor, initialRouteName, tabBar, renderCircle, borderTopLeftRight, shadowStyle, borderColor, borderWidth, ...restProps } = props;
        return (
            <Tab.Navigator screenOptions={{}} {...(restProps as any)} tabBar={MyTabBar}>
                {children?.map((e: any) => {
                    const Component = e?.props?.component;

                    return (
                        <Tab.Screen
                            options={e?.props?.options}
                            key={e?.props?.name}
                            name={e?.props?.name}
                        >
                            {(props) => <Component {...props} />}
                        </Tab.Screen>
                    );
                })}
            </Tab.Navigator>
        );
    }, [MyTabBar, children, props]);

    return main;
});

function useDeviceOrientation() {
    const { width, height } = useWindowDimensions();

    return width < height ? 'PORTRAIT' : 'LANDSCAPE';
}

export default BottomBarComponent;