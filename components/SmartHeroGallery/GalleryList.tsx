import React, { RefObject, useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, ViewToken } from 'react-native';
import { GalleryItem, PageLayout } from '../../types/gallery';
import { GalleryPage } from './GalleryPage';

type Props = {
    pages: PageLayout[];
    onPressItem: (item: GalleryItem) => void;
    listRef?: RefObject<FlatList>;
    onScroll?: () => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEIGHT = 400;

export function GalleryList({ pages, onPressItem, listRef, onScroll }: Props) {
    const [viewableIndex, setViewableIndex] = useState<number>(0);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            const index = viewableItems[0].index;
            if (index !== null) {
                setViewableIndex(index);
            }
        }
    }).current;

    // Viewability config: Item is considered viewable if > 50% visible
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 60,
    }).current;

    const renderItem = useCallback(({ item, index }: { item: PageLayout; index: number }) => {
        return (
            <GalleryPage
                page={item}
                isVisible={index === viewableIndex}
                onPressItem={onPressItem}
                width={SCREEN_WIDTH}
                height={HEIGHT}
            />
        );
    }, [viewableIndex, onPressItem]);

    return (
        <FlatList
            ref={listRef}
            data={pages}
            renderItem={renderItem}
            keyExtractor={(_, index) => `page-${index}`}
            horizontal
            pagingEnabled
            snapToInterval={SCREEN_WIDTH}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            windowSize={3}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            removeClippedSubviews={true}
            onScroll={onScroll}
        />
    );
}
