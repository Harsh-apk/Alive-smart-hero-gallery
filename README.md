# Smart Hero Gallery

A smart, horizontally scrollable hero gallery built with React Native (Expo). This project is a solution for the "Alive" Take-Home Assignment.

## Setup Steps

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run the App**:
    ```bash
    npm start
    ```
    - Press `i` to run on iOS Simulator.
    - Press `w` to run on Web.
    - Press `a` to run on Android Emulator.
3.  **Run Tests**:
    ```bash
    npm test
    ```

## Core Logic & Order Preservation

The core logic resides in `utils/pageBuilder.ts`.
- **Goal**: Build 2-column pages (Hero + 2 Stacked) while prioritizing a 9:16 video.
- **Order Preservation**: We use a greedy approach with a **lookahead buffer** (default 12 items).
    1.  We look ahead `N` items to find the "best" video candidate (closest to 9:16 aspect ratio).
    2.  If a video is found, we select it for the current page and pull it out of the queue.
    3.  We then greedily select the next available images to fill the remaining slots (usually 2 images).
    4.  If a video is *not* found (or already used), we preserve the original API order for images.
    5.  **Tie-Breaker**: If two videos have the same "best" aspect ratio, we pick the one appearing earlier in the list.

## Media Loading & Fallbacks

We implemented a robust progressive loading strategy in `components/SmartHeroGallery/GalleryMedia.tsx`:
1.  **Preview**: Instantly show the lightweight preview thumbnail (blurhash or small image).
2.  **Processed**: Attempt to load the optimized mobile version.
3.  **Original**: If processed fails (onError), automatically fallback to the original high-res URL.

**Videos**:
- Automatically show the **poster** (using the same fallback chain: Preview -> Processed -> Original) while the video buffers.
- Video playback is auto-managed based on viewability.

## Performance Optimizations

To ensure smooth scrolling with 100+ items:
- **`FlatList` Configuration**:
    - `windowSize={3}`: Reduces memory by rendering only adjacent pages.
    - `removeClippedSubviews={true}`: Unmounts views off-screen.
    - `initialNumToRender={1}`: Fast startup.
- **Viewability**:
    - We track the visible page index using `onViewableItemsChanged` and `viewabilityConfig`.
    - Videos **auto-pause** when their page is not visible to save CPU/Battery.
- **Memoization**:
    - `buildPages` is memoized with `useMemo`.
    - Render functions are stable with `useCallback`.

## Smart Cover Approach

To minimize cropping while filling the fixed layout:
- We use `contentFit="cover"` (equivalent to `resizeMode="cover"`).
- **Why**: This scales the image to fill the container, ensuring no empty space. It inherently crops "mainly on one axis" depending on the difference between the container's aspect ratio and the content's aspect ratio.
- For the **Full Screen Modal**, we switch to `contentFit="contain"` (or allow standard fit) to ensure the user sees the full content without cropping.

## Future Improvements

- **Virtualization for Modal**: The `DetailModal` currently uses a fresh `FlatList`. For extremely large lists, passing shared elements or syncing state more deeply would be better.
- **Prefetching**: Implement "Page N+1" prefetching (Extra 1) for even smoother media display.
- **E2E Testing**: Add Maestro or Detox tests for full scroll flows.
