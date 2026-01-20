import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GalleryItem, PageLayout } from '../../types/gallery';
import { GalleryMedia } from './GalleryMedia';

type Props = {
    page: PageLayout;
    isVisible: boolean;
    onPressItem: (item: GalleryItem) => void;
    width: number;
    height: number;
};

export function GalleryPage({ page, isVisible, onPressItem, width, height }: Props) {
    return (
        <View style={[styles.container, { width, height }]}>
            {/* Column 1: Left Hero */}
            <View style={styles.leftColumn}>
                <GalleryMedia
                    item={page.left}
                    style={styles.media}
                    isVisible={isVisible} // Video might be here
                    onPress={() => onPressItem(page.left)}
                />
            </View>

            {/* Column 2: Right Stacked */}
            <View style={styles.rightColumn}>
                <View style={styles.rightItemContainer}>
                    <GalleryMedia
                        item={page.rightTop}
                        style={styles.media}
                        isVisible={isVisible} // Video might be here (rare fallback)
                        onPress={() => onPressItem(page.rightTop)}
                    />
                </View>
                <View style={styles.rightItemContainer}>
                    <GalleryMedia
                        item={page.rightBottom}
                        style={styles.media}
                        isVisible={isVisible} // Video might be here (rare fallback)
                        onPress={() => onPressItem(page.rightBottom)}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    leftColumn: {
        flex: 1, // 50% width if equal? Prompt says "One large file... Two files stacked... Fixed 2-column block". Usually 50-50 or 60-40.
        // "One large file... Two files stacked." Usually implies col-1 is full height, col-2 is two half-heights.
        // Let's assume 50% width split for now.
        marginRight: 2, // Gutter
    },
    rightColumn: {
        flex: 1,
        flexDirection: 'column',
    },
    rightItemContainer: {
        flex: 1, // Equal height
        marginBottom: 2, // Gutter for top item
    },
    media: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});
