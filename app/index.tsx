import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SmartHeroGallery } from '../components/SmartHeroGallery';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Experience</Text>
                </View>
                <SmartHeroGallery />
                <View style={styles.content}>
                    <Text style={styles.text}>More content below...</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        padding: 20,
        paddingTop: 60,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        height: 800, // Dummy content space
    },
    text: {
        fontSize: 16,
        color: '#666',
    },
});
