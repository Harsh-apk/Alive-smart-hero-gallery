import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

    const [videoSrc, setVideoSrc] = useState(getVideoUrl(item.src, 'processed'));
    const [videoError, setVideoError] = useState(false);

    // Fallback state tracking
    const [hasFailedProcessed, setHasFailedProcessed] = useState(false);

    // Video State
    // We update source if fallback is needed
    const player = useVideoPlayer(videoSrc, (player) => {
        player.loop = true;
        player.muted = true;
        // Auto-play is handled by effect
    });

    // Listen for video errors
    useEffect(() => {
        // Fallback Logic Implementation if needed based on external error triggers
    }, [videoSrc]);


    const [showPoster, setShowPoster] = useState(true);

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

    // Handle Poster visibility
    useEffect(() => {
        if (item.type === 'video') {
            const subscription = player.addListener('playingChange', (isPlaying) => {
                if (isPlaying) {
                    setShowPoster(false);
                }
            });
            return () => subscription.remove();
        }
    }, [player, item.type]);


    const handleImageError = () => {
        if (!hasFailedProcessed) {
            setHasFailedProcessed(true);
            const original = item.type === 'video'
                ? getVideoPosterUrl(item.src, 'original')
                : getImageUrl(item.src, 'original');
            setImageSrc(original);
        }
    };

    const handleVideoRetry = () => {
        if (!videoError) {
            // First failure: Try original
            setVideoError(true);
            setVideoSrc(getVideoUrl(item.src, 'original'));
        } else {
            // Already failed original? Just replay.
            player.replay();
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

                {/* Poster Overlay */}
                {showPoster && (
                    <Image
                        source={{ uri: imageSrc }}
                        placeholder={{ uri: getVideoPosterUrl(item.src, 'preview') }}
                        style={StyleSheet.absoluteFill}
                        contentFit={contentFit}
                        transition={200}
                    />
                )}

                {/* Retry Overlay */}
                {videoError && (
                    <View style={[StyleSheet.absoluteFill, styles.centered, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                        <TouchableOpacity onPress={handleVideoRetry} style={styles.retryButton}>
                            <Ionicons name="refresh-circle" size={48} color="#fff" />
                            <Text style={styles.retryText}>Tap to retry</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryButton: {
        alignItems: 'center',
    },
    retryText: {
        color: '#fff',
        marginTop: 4,
        fontWeight: '600',
    },
});
