import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StatusBar as RNStatusBar, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SmartHeroGallery } from '../components/SmartHeroGallery';

import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <RNStatusBar barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <View style={styles.topRow}>
                        <View style={styles.tagContainer}>
                            <Text style={styles.tagText}>Horse Riding</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={styles.ratingText}>4.9 (128 reviews)</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>Horse Riding Forest Safari</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.locationText}>Bengaluru, India • 45 mins from city center</Text>
                    </View>
                </View>

                {/* Gallery Section - Centerpiece */}
                <View style={styles.galleryWrapper}>
                    <SmartHeroGallery />
                </View>

                {/* Content Body */}
                <View style={styles.bodyContainer}>

                    {/* Quick Stats Grid */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Feather name="clock" size={20} color="#333" />
                            <Text style={styles.statLabel}>Duration</Text>
                            <Text style={styles.statValue}>1 hr 15 mins</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.statItem}>
                            <Feather name="users" size={20} color="#333" />
                            <Text style={styles.statLabel}>Group Size</Text>
                            <Text style={styles.statValue}>Up to 8</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="horse-variant" size={20} color="#333" />
                            <Text style={styles.statLabel}>Experience</Text>
                            <Text style={styles.statValue}>All Levels</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About this experience</Text>
                        <Text style={styles.descriptionText}>
                            Experience horse riding like never before. Connect deeply with glorious horses as you spend time grooming and caring for them at the stables. Then, embark on a long ride through a silent forest trail. End the day with a delicious four-course Italian meal at an equestrian-themed Italian restaurant.
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Highlights */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Top Highlights</Text>

                        <View style={styles.highlightItem}>
                            <View style={styles.highlightIcon}>
                                <Ionicons name="leaf-outline" size={20} color="#000" />
                            </View>
                            <View style={styles.highlightContent}>
                                <Text style={styles.highlightTitle}>Private Forest Trail</Text>
                                <Text style={styles.highlightDesc}>Ride silently down a picturesque forest trail set within the campus.</Text>
                            </View>
                        </View>

                        <View style={styles.highlightItem}>
                            <View style={styles.highlightIcon}>
                                <Ionicons name="restaurant-outline" size={20} color="#000" />
                            </View>
                            <View style={styles.highlightContent}>
                                <Text style={styles.highlightTitle}>Gourmet Italian Meal</Text>
                                <Text style={styles.highlightDesc}>Enjoy a four-course Italian feast at the on-property restaurant.</Text>
                            </View>
                        </View>

                        <View style={styles.highlightItem}>
                            <View style={styles.highlightIcon}>
                                <Ionicons name="heart-outline" size={20} color="#000" />
                            </View>
                            <View style={styles.highlightContent}>
                                <Text style={styles.highlightTitle}>Bond with Horses</Text>
                                <Text style={styles.highlightDesc}>Learn from the best at top equestrian sports schools and care for these majestic heroes.</Text>
                            </View>
                        </View>
                    </View>

                    {/* Host Info */}
                    <View style={styles.hostContainer}>
                        <View style={styles.hostAvatar}>
                            <Text style={styles.hostInitial}>A</Text>
                        </View>
                        <View>
                            <Text style={styles.hostName}>Hosted by Alive</Text>
                            <Text style={styles.hostBio}>Premium Experiences • Joined 2021</Text>
                        </View>
                    </View>

                </View>

                {/* Bottom padding for floating footer */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Floating Action Footer */}
            <View style={styles.footerContainer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Starting from</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        <Text style={styles.priceValue}>₹2,880</Text>
                        <Text style={styles.pricePer}>/person</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.bookButton}
                    activeOpacity={0.8}
                    onPress={() => router.push('/availability')}
                >
                    <Text style={styles.bookButtonText}>Check Availability</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        backgroundColor: '#fff',
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tagContainer: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        textDecorationLine: 'underline',
    },
    title: {
        fontSize: 32, // Large premium title
        fontWeight: '800', // Bold
        color: '#000',
        lineHeight: 40,
        marginBottom: 8,
        fontFamily: 'System', // Use system font but bold
        letterSpacing: -0.5,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    locationText: {
        fontSize: 15,
        color: '#666',
    },
    galleryWrapper: {
        marginVertical: 10,
        // Gallery handles its own width/height
    },
    bodyContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#E0E0E0',
        height: '80%',
        alignSelf: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 8,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 24,
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 26,
        color: '#444',
    },
    highlightItem: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    highlightIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        marginTop: 2,
    },
    highlightContent: {
        flex: 1,
    },
    highlightTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    highlightDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    hostContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        marginBottom: 20,
    },
    hostAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    hostInitial: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    hostName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    hostBio: {
        fontSize: 14,
        color: '#666',
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 16,
        paddingBottom: 34,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    priceContainer: {
        flexDirection: 'column',
    },
    priceLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    priceValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    pricePer: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    bookButton: {
        backgroundColor: '#FF385C', // Brand color or Black? Alive uses Red/Pinkish in screenshot.
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#FF385C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
