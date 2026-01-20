import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

type Props = {
    onPress: () => void;
    visible: boolean;
};

export function Nudge({ onPress, visible }: Props) {
    const translateX = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            translateX.value = 0;
            translateX.value = withRepeat(
                withSequence(
                    // "Beckoning" motion:
                    // 1. Quick move left (suggestion)
                    withTiming(-12, { duration: 300, easing: Easing.out(Easing.cubic) }),
                    // 2. Slower return (relax)
                    withTiming(0, { duration: 800, easing: Easing.inOut(Easing.quad) }),
                    // 3. Short pause
                    withDelay(3000, withTiming(0, { duration: 0 }))
                ),
                -1,
                false
            );
        } else {
            cancelAnimation(translateX);
            translateX.value = 0;
        }
        return () => cancelAnimation(translateX);
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <Animated.View
            style={[
                styles.container,
                animatedStyle,
                { display: visible ? 'flex' : 'none' }
            ]}
        >
            <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.8}>
                {/* <Text style={styles.text}>SCROLL</Text> */}
                <Ionicons name="chevron-forward" size={28} color="#fff" style={styles.shadow} />
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
        // backgroundColor: 'rgba(0,0,0,0.6)', 
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 24,
        gap: 6,
    },
    text: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 1.2,
        textShadowColor: 'rgba(0, 0, 0, 0.9)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    }
});
