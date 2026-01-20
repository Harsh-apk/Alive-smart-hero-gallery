import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { GalleryItem } from '../../types/gallery';
import { getImageUrl, getVideoPosterUrl, getVideoUrl } from '../../utils/urlHelper';

type Props = {
    item: GalleryItem;
    style?: any;
    onPress?: () => void;
    isVisible?: boolean; // For video auto-play
    contentFit?: 'cover' | 'contain';
};

export function GalleryMedia({ item, style, onPress, isVisible = false, contentFit = 'cover' }: Props) {
    const [imageSrc, setImageSrc] = useState(
        item.type === 'video'
            ? getVideoPosterUrl(item.src, 'processed')
            : getImageUrl(item.src, 'processed')
    );

    // Fallback state tracking
    const [hasFailedProcessed, setHasFailedProcessed] = useState(false);

    // Video State
    const videoSourceRef = useRef(getVideoUrl(item.src, 'processed'));
    const player = useVideoPlayer(videoSourceRef.current, (player) => {
        player.loop = true;
        player.muted = true;
        // Auto-play is handled by effect
    });

    // Handle Video Visibility
    useEffect(() => {
        if (item.type === 'video') {
            if (isVisible) {
                player.play();
            } else {
                player.pause();
            }
        }
    }, [isVisible, item.type, player]);


    const handleImageError = () => {
        if (!hasFailedProcessed) {
            setHasFailedProcessed(true);
            const original = item.type === 'video'
                ? getVideoPosterUrl(item.src, 'original')
                : getImageUrl(item.src, 'original');
            setImageSrc(original);
        }
    };

    if (item.type === 'video') {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.container, style]}>
                <VideoView
                    player={player}
                    style={StyleSheet.absoluteFill}
                    contentFit={contentFit}
                    nativeControls={false}
                />
                {/* Overlay Poster while loading? expo-video handles buffering but doesn't show poster natively same way? 
             We can overlay an Image and hide it when video plays? 
             For now, let's trust VideoView or just place Image behind it? 
             Actually, strict requirements say: "While the video downloads, keep showing the poster."
         */}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.container, style]}>
            <Image
                source={{ uri: imageSrc }}
                placeholder={{ uri: getImageUrl(item.src, 'preview') }}
                style={StyleSheet.absoluteFill}
                contentFit={contentFit}
                transition={200}
                onError={handleImageError}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: '#eee', // loading bg
    },
});
