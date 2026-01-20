import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

type Props = {
    onPress: () => void;
    visible: boolean;
};

export function Nudge({ onPress, visible }: Props) {
    const translateX = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            translateX.value = withRepeat(
                withSequence(
                    withTiming(-10, { duration: 500 }),
                    withTiming(0, { duration: 500 })
                ),
                -1, // Infinite
                true // Reverse
            );
        }
    }, [visible, translateX]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.8}>
                <Text style={styles.text}>Scroll</Text>
                <Ionicons name="chevron-forward-circle" size={32} color="#fff" style={styles.shadow} />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 20,
        top: '50%',
        marginTop: -20,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchable: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 24,
        gap: 4,
    },
    text: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    }
});
