import { Image } from 'expo-image';
import React, { RefObject, useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, ViewToken } from 'react-native';
import { GalleryItem, PageLayout } from '../../types/gallery';
import { getImageUrl, getVideoPosterUrl } from '../../utils/urlHelper';
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

    // Prefetching Logic: When viewableIndex changes, prefetch next pages (N+1, N+2)
    React.useEffect(() => {
        const indicesToPrefetch = [viewableIndex + 1, viewableIndex + 2];

        indicesToPrefetch.forEach(nextIndex => {
            if (nextIndex < pages.length) {
                const page = pages[nextIndex];
                const itemsToPrefetch = [page.left, page.rightTop, page.rightBottom];

                itemsToPrefetch.forEach(item => {
                    let url;
                    if (item.type === 'image') {
                        url = getImageUrl(item.src, 'processed');
                    } else if (item.type === 'video') {
                        // For video, we only prefetch the poster image. 
                        url = getVideoPosterUrl(item.src, 'processed');
                    }

                    if (url) {
                        Image.prefetch(url);
                    }
                });
            }
        });
    }, [viewableIndex, pages]);

    // Viewability config: Item is considered viewable if > 60% visible
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
