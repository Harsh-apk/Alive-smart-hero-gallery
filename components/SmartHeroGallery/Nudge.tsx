import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
    onPress: () => void;
    visible: boolean;
};

export function Nudge({ onPress, visible }: Props) {
    if (!visible) return null;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.circle}>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 10,
        top: '50%',
        marginTop: -20,
        zIndex: 10,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
