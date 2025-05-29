import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Agenda, DateData, AgendaEntry, AgendaSchedule, LocaleConfig } from 'react-native-calendars';
import testIDs from './testIDs';

// Cấu hình ngôn ngữ tiếng Việt
LocaleConfig.locales['vi'] = {
    monthNames: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ],
    monthNamesShort: [
        'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6',
        'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'
    ],
    dayNames: [
        'Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư',
        'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'
    ],
    dayNamesShort: ['CN', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7'],
    today: 'Hôm nay'
};
LocaleConfig.defaultLocale = 'vi';

const CalendarScreen: React.FC = () => {
    const [items, setItems] = useState<AgendaSchedule | undefined>(undefined);

    const loadItems = (day: DateData) => {
        const newItems = items ? { ...items } : {};
        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);
                if (!newItems[strTime]) {
                    newItems[strTime] = [];
                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        newItems[strTime].push({
                            name: 'Công việc cho ' + strTime + ' #' + j,
                            height: Math.max(50, Math.floor(Math.random() * 150)),
                            day: strTime
                        });
                    }
                }
            }
            setItems({ ...newItems });
        }, 1000);
    };

    const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
        const fontSize = isFirst ? 16 : 14;
        const color = isFirst ? 'black' : '#43515c';
        return (
            <TouchableOpacity
                testID={testIDs.agenda.ITEM}
                style={[styles.item, { height: reservation.height }]}
                onPress={() => Alert.alert(reservation.name)}
            >
                <Text style={{ fontSize, color }}>{reservation.name}</Text>
            </TouchableOpacity>
        );
    };

    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text>Không có công việc nào trong ngày này!</Text>
            </View>
        );
    };

    const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
        return r1.name !== r2.name;
    };

    function timeToString(time: number) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <View style={{ flex: 1, marginTop: 22, marginBottom: 55, backgroundColor: 'black' }}>
            <Agenda
                testID={testIDs.agenda.CONTAINER}
                items={items}
                loadItemsForMonth={loadItems}
                selected={getCurrentDate()}
                renderItem={renderItem}
                renderEmptyDate={renderEmptyDate}
                rowHasChanged={rowHasChanged}
                showClosingKnob={true}
                theme={{
                    agendaDayTextColor: 'black',
                    agendaDayNumColor: 'black',
                    agendaTodayColor: 'blue',
                    agendaKnobColor: 'lightgrey',
                    dotColor: 'red',
                    selectedDayBackgroundColor: 'blue',
                    selectedDayTextColor: 'white',
                    todayTextColor: 'black',
                    dayTextColor: 'black',
                    textDisabledColor: '#d9e1e8',
                    monthTextColor: 'black',
                    textDayFontSize: 14,
                    textMonthFontSize: 14,
                    textDayHeaderFontSize: 14
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    customDay: {
        margin: 10,
        fontSize: 24,
        color: 'green'
    },
    dayItem: {
        marginLeft: 34
    }
});

export default CalendarScreen;
