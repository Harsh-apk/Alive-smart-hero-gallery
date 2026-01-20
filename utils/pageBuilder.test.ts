import { GalleryItem } from "../types/gallery";
import { buildPages } from "./pageBuilder";

const mockImage = (id: string): GalleryItem => ({
    _id: id,
    type: "image",
    src: `img_${id}.jpg`,
    aspectRatio: 1,
});

const mockVideo = (id: string, ar: number = 9 / 16): GalleryItem => ({
    _id: id,
    type: "video",
    src: `vid_${id}.mp4`,
    aspectRatio: ar,
});

describe("buildPages", () => {
    it("should build simple pages from all images", () => {
        const items = [
            mockImage("1"), mockImage("2"), mockImage("3"),
            mockImage("4"), mockImage("5"), mockImage("6"),
        ];

        const pages = buildPages(items);
        expect(pages).toHaveLength(2);
        expect(pages[0].left._id).toBe("1");
        expect(pages[0].rightTop._id).toBe("2");
        expect(pages[0].rightBottom._id).toBe("3");
        expect(pages[1].left._id).toBe("4");
    });

    it("should prioritize video in left column if present", () => {
        const items = [
            mockImage("1"), mockVideo("2"), mockImage("3"),
        ];
        const pages = buildPages(items);
        expect(pages).toHaveLength(1);
        expect(pages[0].left._id).toBe("2"); // Video should be left
        expect(pages[0].rightTop._id).toBe("1");
        expect(pages[0].rightBottom._id).toBe("3");
    });

    it("should pick closest 9:16 video from lookahead", () => {
        // Lookahead default is 12.
        // We have video A (1:1 aspect) at index 0
        // Video B (9:16 exact) at index 5.
        // Should pick Video B for page 1.
        const items = [
            mockVideo("A", 1), // Bad AR
            mockImage("1"), mockImage("2"), mockImage("3"), mockImage("4"),
            mockVideo("B", 9 / 16), // Perfect AR
            mockImage("5"),
        ];

        const pages = buildPages(items, { lookahead: 10 });
        expect(pages[0].left._id).toBe("B");

        // Remaining items should form the rest
        // Page 1 uses B, and 2 images (1, 2)
        expect(pages[0].rightTop._id).toBe("1");
        expect(pages[0].rightBottom._id).toBe("2");
    });

    it("should enforce max 1 video per page", () => {
        const items = [
            mockVideo("1"), mockVideo("2"), mockImage("3"), mockImage("4"),
        ];
        // Need 1 Video + 2 Images to make a "Video Page".
        // We have 2 Videos, 2 Images.
        // Page 1: Video(1), Image(3), Image(4).
        // Remaining: Video(2).
        // Cannot make Page 2 (needs 2 images).

        const pages = buildPages(items);
        expect(pages).toHaveLength(1);
        expect(pages[0].left._id).toBe("1");
        expect(pages[0].rightTop._id).toBe("3");
        expect(pages[0].rightBottom._id).toBe("4");
    });

    it("should allow reordering to fetch 2 images for the video", () => {
        // Video at 0. Image at 1. Video at 2. Image at 3.
        // Should pick Video(0), Image(1), Image(3).
        const items = [
            mockVideo("v1"), mockImage("i1"), mockVideo("v2"), mockImage("i2"),
        ];

        const pages = buildPages(items);
        expect(pages).toHaveLength(1);
        expect(pages[0].left._id).toBe("v1");
        expect(pages[0].rightTop._id).toBe("i1");
        expect(pages[0].rightBottom._id).toBe("i2");
    });

    it("should stop if not enough items for a full page", () => {
        const items = [mockImage("1"), mockImage("2")];
        const pages = buildPages(items);
        expect(pages).toHaveLength(0);
    });
});
