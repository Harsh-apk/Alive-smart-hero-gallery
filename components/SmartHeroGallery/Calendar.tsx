import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

type Props = {
    onSelectDate?: (date: Date) => void;
    initialDate?: Date;
};

export function Calendar({ onSelectDate, initialDate }: Props) {
    const [viewDate, setViewDate] = useState(initialDate || new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const changeMonth = (increment: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + increment);
        setViewDate(newDate);
    };

    const handleDatePress = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setSelectedDate(newDate);
        onSelectDate?.(newDate);
    };

    const renderDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        }

        // Days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            const isSelected = selectedDate &&
                selectedDate.getDate() === i &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

            const isToday = !isSelected && isSameDay(new Date(), new Date(year, month, i));

            days.push(
                <TouchableOpacity
                    key={`day-${i}`}
                    style={[
                        styles.dayCell,
                        isSelected && styles.selectedDay,
                        isToday && styles.todayCell
                    ]}
                    onPress={() => handleDatePress(i)}
                >
                    <Text style={[
                        styles.dayText,
                        isSelected && styles.selectedDayText,
                        isToday && styles.todayText
                    ]}>
                        {i}
                    </Text>
                </TouchableOpacity>
            );
        }

        return days;
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => changeMonth(-1)} hitSlop={10}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>
                    {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                </Text>
                <TouchableOpacity onPress={() => changeMonth(1)} hitSlop={10}>
                    <Ionicons name="chevron-forward" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Days of Week */}
            <View style={styles.weekRow}>
                {DAYS.map(day => (
                    <Text key={day} style={styles.weekDayText}>{day}</Text>
                ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.grid}>
                {renderDays()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E', // Dark surface
        borderRadius: 12,
        padding: 16,
        // width: '100%', // Flexible width
        maxWidth: 340,
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    weekDayText: {
        flex: 1,
        textAlign: 'center',
        color: '#8E8E93',
        fontSize: 13,
        fontWeight: '600',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%', // 100% / 7
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 4,
    },
    dayText: {
        color: '#fff',
        fontSize: 16,
    },
    selectedDay: {
        backgroundColor: '#0A84FF', // iOS Blue
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    todayCell: {
        backgroundColor: '#333',
    },
    todayText: {
        color: '#0A84FF',
        fontWeight: 'bold',
    }
});
