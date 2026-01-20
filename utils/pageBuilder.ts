import { GalleryItem, PageLayout } from "../types/gallery";

const VIDEO_ASPECT_RATIO_TARGET = 9 / 16; // 0.5625

type BuildPagesOptions = {
    lookahead?: number;
};

/**
 * Builds pages from a list of gallery items.
 * Rules:
 * - Each page has 3 items.
 * - Max 1 video per page.
 * - Video preference: Closest to 9:16 (checked within lookahead).
 * - Layout: Left (Hero), RightTop, RightBottom.
 * - Fill preference: Col 1 = Video (if any), Col 2 = Images.
 */
export function buildPages(
    items: GalleryItem[],
    opts?: BuildPagesOptions
): PageLayout[] {
    const pages: PageLayout[] = [];
    const lookahead = opts?.lookahead ?? 1000; // Increased to ensure we find videos if they exist (Video Rule > Order Rule)


    // Create a mutable copy to track remaining items
    // We need to identify items by ID to remove them correctly if we pick out-of-order
    let remaining = [...items];

    while (remaining.length >= 3) {
        // 1. Identify valid video candidates within lookahead
        const pool = remaining.slice(0, lookahead);
        const videoCandidates = pool
            .map((item, index) => ({ item, index }))
            .filter((x) => x.item.type === "video");

        let selectedVideo: GalleryItem | null = null;

        if (videoCandidates.length > 0) {
            // Sort by closeness to 9:16, then by original index
            videoCandidates.sort((a, b) => {
                const arA = a.item.aspectRatio ?? 1; // Default to 1 if missing?
                const arB = b.item.aspectRatio ?? 1;
                const diffA = Math.abs(arA - VIDEO_ASPECT_RATIO_TARGET);
                const diffB = Math.abs(arB - VIDEO_ASPECT_RATIO_TARGET);

                if (Math.abs(diffA - diffB) < 0.0001) {
                    return a.index - b.index; // Tie-breaker: earlier index
                }
                return diffA - diffB;
            });
            selectedVideo = videoCandidates[0].item;
        }
        // 2. Select items for the page
        // We need 3 items total.
        // If we have a selectedVideo, we MUST use it (unless we can't find 2 images to pair with it).
        // If no video, we need 3 images.

        let pageItems: GalleryItem[] = [];

        if (selectedVideo) {
            // Try to find 2 images
            const images: GalleryItem[] = [];
            for (const item of remaining) {
                if (item.type === "image" && item._id !== selectedVideo._id) {
                    images.push(item);
                    if (images.length === 2) break;
                }
            }

            if (images.length === 2) {
                // We have a valid set: 1 Video, 2 Images
                pageItems = [selectedVideo, ...images];
            } else {
                // Not enough images to pair with the best video.
                // Can we form a page without the video? (3 images)
                // Or do we stop?
                // Prompt says "Fill the page... If images are not enough... allow selected video in Col 2".
                // BUT "Only one video is allowed per page".
                // If we have [Video, Image] (total 2 remaining valid items?) -> Stop, need 3.
                // If we found the best video but run out of images to complete the page, we essentially can't build a page with that video.
                // Let's try to fall back to "No Video" strategy if possible?
                // If we check for 3 images:
                const threeImages: GalleryItem[] = [];
                for (const item of remaining) {
                    if (item.type === "image") {
                        threeImages.push(item);
                        if (threeImages.length === 3) break;
                    }
                }
                if (threeImages.length === 3) {
                    pageItems = threeImages;
                } else {
                    // Can't make a video page (need 2 images), can't make an image page (need 3 images).
                    // Stop logic.
                    break;
                }
            }
        } else {
            // No video in lookahead (or none at all).
            // Try to take 3 items.
            // But we must respect "Max 1 video" rule implicitly if we just take top 3?
            // If top 3 are [Img, Img, Img] -> OK.
            // If top 3 are [Img, Vid, Img] -> OK (1 Video).
            // But we just searched for video and didn't find one?
            // Ah, "videoCandidates" covers the pool.
            // If `videoCandidates` is empty, then `pool` (next 12) has NO videos.
            // So top 3 must be images (or empty).
            // So checking top 3 is safe provided they exist.
            if (remaining.length >= 3) {
                // Double check types just in case logic drifts
                const candidates = remaining.slice(0, 3);
                const vidCount = candidates.filter(i => i.type === "video").length;
                if (vidCount > 1) {
                    // Should not happen if lookahead covered them?
                    // If lookahead < 3, maybe. But default is 12.
                    // If we have [Vid, Vid, Vid] and lookahead found them?
                    // Then `selectedVideo` would be set.
                    // So this branch implies NO videos in lookahead.
                    // So candidates are all images.
                    pageItems = candidates;
                } else {
                    pageItems = candidates;
                }
            }
        }

        if (pageItems.length === 3) {
            // Construct Page Layout
            // Rules:
            // Col 1: Preferred Video, else Image.
            // Col 2: Two files (Image preferred).

            const video = pageItems.find(i => i.type === "video");
            const images = pageItems.filter(i => i.type === "image");

            let left: GalleryItem;
            let rightTop: GalleryItem;
            let rightBottom: GalleryItem;

            if (video) {
                // Case: 1 Video, 2 Images
                // Prefer video in Col 1
                left = video;
                rightTop = images[0];
                rightBottom = images[1];

                // "If images are not enough for Column 2, allow the selected video to be placed in Column 2"
                // This is the fallback logical case mentioned in prompt.
                // When would images NOT be enough for Col 2?
                // If we have < 2 images in the SET of 3?
                // But we specifically built the set to have 2 images if a video is present.
                // So we always have 2 images here.
                // Thus Video always goes to Left.
            } else {
                // Case: 3 Images
                // Keep order?
                // "Preserve API order as much as possible"
                // Sort pageItems by their original index? 
                // In our logic `pageItems` might be [Video(idx 5), Image(idx 0), Image(idx 1)].
                // If we assign strictly: Left=Video, Right=Img, Img.
                // If 3 Images: Left=Img(0), Right=Img(1), Img(2).
                left = pageItems[0];
                rightTop = pageItems[1];
                rightBottom = pageItems[2];
            }

            pages.push({ left, rightTop, rightBottom });

            // Remove used items from remaining
            // Be careful to remove exactly the instances we used
            const usedIds = new Set(pageItems.map(i => i._id));
            remaining = remaining.filter(i => !usedIds.has(i._id));

        } else {
            // Could not form a full page
            break;
        }
    }

    return pages;
}
