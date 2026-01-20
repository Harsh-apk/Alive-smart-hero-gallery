import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GalleryItem } from '../../types/gallery';
import { GalleryMedia } from './GalleryMedia';

type Props = {
    visible: boolean;
    initialItem: GalleryItem;
    items: GalleryItem[];
    onClose: () => void;
};

const { width, height } = Dimensions.get('window');

export function DetailModal({ visible, initialItem, items, onClose }: Props) {
    // Find initial index
    const initialIndex = items.findIndex(i => i._id === initialItem._id);
    const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

    // We need a carousel here. 
    // PagerView is good for full screen paging. Or FlatList horizontal paging.
    // Since we already used FlatList for the main gallery, let's stick to FlatList for consistency (and less deps).

    const renderItem = ({ item }: { item: GalleryItem }) => {
        return (
            <View style={styles.page}>
                {/* Full screen media */}
                <GalleryMedia
                    item={item}
                    style={styles.media}
                    isVisible={true} // Autoplay video in modal? Yes.
                // "In full screen, it should show full content without truncate unlike cover."
                // GalleryMedia currently does `contentFit="cover"`.
                // We need to override style or pass a prop for `contentFit="contain"`.
                // Let's modify GalleryMedia to accept `contentFit` prop? 
                // Or just override via style? `expo-image` style doesn't control fit? 
                // `contentFit` is a prop.
                // I need to modify GalleryMedia to accept `contentFit` prop.
                />
            </View>
        );
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
