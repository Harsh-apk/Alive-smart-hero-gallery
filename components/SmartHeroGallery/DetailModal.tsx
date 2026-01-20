import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { GalleryItem } from '../../types/gallery';
import { GalleryMedia } from './GalleryMedia';

type Props = {
    visible: boolean;
    initialItem: GalleryItem;
    items: GalleryItem[];
    onClose: () => void;
};

const { width, height } = Dimensions.get('window');

const DetailItem = React.memo(({ item }: { item: GalleryItem }) => {
    if (item.type === 'video') {
        return (
            <View style={styles.page}>
                <GalleryMedia
                    item={item}
                    style={styles.media}
                    isVisible={true}
                    contentFit="contain"
                />
            </View>
        );
    }

    // Zoomable Image
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const pinch = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            if (scale.value < 1) {
                scale.value = withSpring(1);
                savedScale.value = 1;
            } else {
                savedScale.value = scale.value;
            }
        });

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            if (scale.value !== 1) {
                scale.value = withSpring(1);
                savedScale.value = 1;
            } else {
                scale.value = withSpring(2);
                savedScale.value = 2;
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const composed = Gesture.Simultaneous(pinch, doubleTap);

    return (
        <GestureHandlerRootView style={styles.page}>
            <GestureDetector gesture={composed}>
                <Animated.View style={[styles.media, animatedStyle, { width: width, height: height }]}>
                    <GalleryMedia
                        item={item}
                        style={{ flex: 1 }}
                        isVisible={true}
                        contentFit="contain"
                    />
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
});

export function DetailModal({ visible, initialItem, items, onClose }: Props) {
    // Find initial index
    const initialIndex = items.findIndex(i => i._id === initialItem._id);
    const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

    // We need a carousel here. 
    // PagerView is good for full screen paging. Or FlatList horizontal paging.
    // Since we already used FlatList for the main gallery, let's stick to FlatList for consistency (and less deps).

    const renderItem = ({ item }: { item: GalleryItem }) => {
        return <DetailItem item={item} />;
    };

    return (
        <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={30} color="#fff" />
                </TouchableOpacity>

                {/* We need to pass contentFit="contain" to GalleryMedia. 
            I'll update GalleryMedia to accept it. 
        */}
                {/* Carousel */}
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    horizontal
                    pagingEnabled
                    initialScrollIndex={initialIndex}
                    getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
                    onScrollToIndexFailed={(info) => {
                        const wait = new Promise(resolve => setTimeout(resolve, 500));
                        wait.then(() => {
                            // Retry? Or ignore.
                        });
                    }}
                    showsHorizontalScrollIndicator={false}
                    windowSize={3}
                    initialNumToRender={1}
                    maxToRenderPerBatch={1}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    page: {
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    media: {
        width: '100%',
        height: '100%',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
