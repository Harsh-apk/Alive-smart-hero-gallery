import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useGalleryData } from '../../hooks/useGalleryData';
import { GalleryItem } from '../../types/gallery';
import { buildPages } from '../../utils/pageBuilder';
import { DetailModal } from './DetailModal';
import { GalleryList } from './GalleryList';
import { Nudge } from './Nudge';

export function SmartHeroGallery() {
    const { data, loading, error } = useGalleryData();
    const pages = useMemo(() => buildPages(data), [data]);

    const [showNudge, setShowNudge] = useState(true);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const listRef = useRef<any>(null);

    const handlePressItem = (item: GalleryItem) => {
        setSelectedItem(item);
    };

    const handleNudge = () => {
        setShowNudge(false);
        listRef.current?.scrollToIndex({ index: 1, animated: true });
    };

    // We need to hide nudge if user scrolls.
    // GalleryList has `onViewableItemsChanged`. 
    // We can pass a callback "onScrollStarted" or check index in parent?
    // Easier: Pass `onPageChange` to GalleryList. But GalleryList handles its own viewability state.
    // Let's modify GalleryList to expose page change or just listen to it?
    // Or just pass `setShowNudge(false)` when index > 0.

    // Actually, GalleryList doesn't expose listRef or scroll events yet.
    // I should elevate the ListRef to here or pass `scrollToNext` down?
    // Better: forwardRef for GalleryList or just pass a callback "onScroll" to it?

    // Let's update `GalleryList` to accept `onPageChange` prop or similar.
    // But wait, `renderItem` is in `GalleryList`.
    // I'll reimplement GalleryList inside here or keep it separate?
    // Separate is cleaner. But I need `ref` to scroll.

    // I'll assume GalleryList exports a ref or I can pass a mutable ref object.
    // For now, let's just edit `GalleryList` to forwardRef?
    // Or just standard callback approach.

    if (loading) {
        return <View style={styles.center}><ActivityIndicator /></View>;
    }

    if (error) {
        return <View style={styles.center}><Text>Error loading gallery</Text></View>;
    }

    return (
        <View style={styles.container}>
            <GalleryList
                pages={pages}
                onPressItem={handlePressItem}
                // ref={listRef} // Need to implement forwardRef in GalleryList
                onScroll={() => setShowNudge(false)} // Need to implement
                listRef={listRef}
            />

            {pages.length > 1 && (
                <Nudge visible={showNudge} onPress={handleNudge} />
            )}

            {selectedItem && (
                <DetailModal
                    visible={!!selectedItem}
                    initialItem={selectedItem}
                    items={data}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 400, // Hero height
        width: '100%',
    },
    center: {
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
