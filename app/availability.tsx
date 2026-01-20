import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AvailabilityScreen() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState('');
    const [adults, setAdults] = useState(2);

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Check Availability</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Calendar */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Date</Text>
                    <View style={styles.calendarContainer}>
                        <Calendar
                            onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
                            markedDates={{
                                [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: '#FF385C' }
                            }}
                            theme={{
                                backgroundColor: '#ffffff',
                                calendarBackground: '#ffffff',
                                textSectionTitleColor: '#b6c1cd',
                                selectedDayBackgroundColor: '#000', // Premium Black
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#FF385C',
                                dayTextColor: '#2d4150',
                                textDisabledColor: '#d9e1e8',
                                dotColor: '#00adf5',
                                selectedDotColor: '#ffffff',
                                arrowColor: 'black',
                                disabledArrowColor: '#d9e1e8',
                                monthTextColor: 'black',
                                indicatorColor: 'black',
                                textDayFontWeight: '500',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '500',
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 14
                            }}
                        />
                    </View>
                </View>

                {/* Time Slots */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Time</Text>
                    <View style={styles.timeSlots}>
                        <TouchableOpacity style={styles.timeSlot}><Text style={styles.timeText}>06:00 AM</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.timeSlot, styles.selectedTime]}><Text style={[styles.timeText, styles.selectedText]}>04:00 PM</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.timeSlot}><Text style={styles.timeText}>05:30 PM</Text></TouchableOpacity>
                    </View>
                </View>

                {/* Guests */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Guests</Text>
                    <View style={styles.guestControl}>
                        <View>
                            <Text style={styles.guestText}>Adults</Text>
                            <Text style={styles.guestSub}>Age 13+</Text>
                        </View>
                        <View style={styles.counter}>
                            <TouchableOpacity
                                style={styles.counterBtn}
                                onPress={() => setAdults(Math.max(1, adults - 1))}
                            >
                                <Feather name="minus" size={20} color="#000" />
                            </TouchableOpacity>

                            <Text style={styles.countText}>{adults}</Text>

                            <TouchableOpacity
                                style={styles.counterBtn}
                                onPress={() => setAdults(adults + 1)}
                            >
                                <Feather name="plus" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View>
                    <Text style={styles.totalPrice}>₹{2880 * adults}</Text>
                    <Text style={styles.taxes}>Total (incl. taxes)</Text>
                </View>
                <TouchableOpacity style={styles.payButton}>
                    <Text style={styles.payText}>Proceed to Pay</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    calendarContainer: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 10,
        overflow: 'hidden',
    },
    timeSlots: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    timeSlot: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedTime: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    timeText: {
        color: '#000',
    },
    selectedText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    guestControl: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
    },
    guestText: {
        fontSize: 16,
        fontWeight: '600',
    },
    guestSub: {
        color: '#666',
        fontSize: 13,
        marginTop: 2,
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    counterBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: {
        fontSize: 16,
        fontWeight: '600',
        minWidth: 20,
        textAlign: 'center',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    taxes: {
        color: '#666',
        fontSize: 12,
    },
    payButton: {
        backgroundColor: '#FF385C',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    payText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
