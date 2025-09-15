import { Dimensions, PixelRatio, Platform, ScaledSize } from "react-native";

const { width, height } = Dimensions.get("window");
const guidelineBaseWidth = 350;
const BASE_SCALE = width / guidelineBaseWidth;

export const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

/**
 * Converts provided width percentage to independent pixel (dp).
 * @param widthPercent The percentage of screen's width that UI element should cover.
 * @return The calculated dp depending on current device's screen width.
 */
export const widthPercentageToDP = (widthPercent: string | number): number => {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

/**
 * Converts provided height percentage to independent pixel (dp).
 * @param heightPercent The percentage of screen's height that UI element should cover.
 * @return The calculated dp depending on current device's screen height.
 */
export const heightPercentageToDP = (heightPercent: string | number): number => {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

/**
 * Adds an orientation change listener.
 * @param that The component instance to update state on orientation change.
 * @return A function to remove the listener.
 */
export const listenOrientationChange = (that: { setState: (state: { orientation: string }) => void }): (() => void) => {
  const subscription = Dimensions.addEventListener("change", ({ window }: { window: ScaledSize }) => {
    const orientation = window.width < window.height ? "portrait" : "landscape";
    that.setState({ orientation });
  });

  // Return a function to remove the listener
  return () => subscription.remove();
};

/**
 * Checks if the platform is iOS.
 * @return True if the platform is iOS, false otherwise.
 */
export const isIos = (): boolean => Platform.OS === "ios";

/**
 * Checks if the platform is Web.
 * @return True if the platform is Web, false otherwise.
 */
export const isWeb = (): boolean => Platform.OS === "web";

/**
 * Returns the screen dimensions.
 * @return An object containing the width and height of the screen.
 */
export const dim = (): { width: number; height: number } => ({ width, height });

/**
 * Normalizes a size value based on the screen width.
 * @param size The size to normalize.
 * @return The normalized size.
 */
export const normalize = (size: number): number => {
  const newSize = size * BASE_SCALE;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Checks if the device is an iPhone X or similar.
 * @return True if the device is an iPhone X or similar, false otherwise.
 */
export const isIphoneX = (): boolean => Platform.OS === "ios" && (isIPhoneXSize() || isIPhoneXrSize());

/**
 * Checks if the device has iPhone X dimensions.
 * @return True if the device has iPhone X dimensions, false otherwise.
 */
export const isIPhoneXSize = (): boolean => {
  const dim = Dimensions.get("window");
  return dim.height === 812 || dim.width === 812;
};

/**
 * Checks if the device has iPhone XR dimensions.
 * @return True if the device has iPhone XR dimensions, false otherwise.
 */
export const isIPhoneXrSize = (): boolean => {
  const dim = Dimensions.get("window");
  return dim.height === 896 || dim.width === 896;
};

/**
 * Returns the app bar height.
 * @param props The height to return.
 * @return The app bar height.
 */
export const AppBarHeight = (props: number): number => props;

/**
 * Returns the status bar height.
 * @return The status bar height.
 */
export const StatusBarHeight = (): number => (Platform.OS === "ios" ? normalize(24) : 0);