import React, { useCallback, useState, useMemo } from 'react';
import { 
  Image as RNImage, 
  View, 
  ViewStyle, 
  StyleProp, 
  ImageStyle as RNImageStyle, 
  ImageProps as RNImageProps,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { isIos } from '../constants/platform';
import { COLORS } from '../constants/colors';

type ResizeMode = 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
type Priority = 'low' | 'normal' | 'high';

type StrictImageStyle = Omit<
  RNImageStyle,
  | "borderRadius"
  | "borderTopLeftRadius"
  | "borderTopRightRadius"
  | "borderBottomLeftRadius"
  | "borderBottomRightRadius"
> & {
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
};

interface AvImageProps extends Omit<RNImageProps, 'source' | 'resizeMode'> {
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<StrictImageStyle>;
  priority?: Priority;
  resizeMode?: ResizeMode;
  source: { uri: string } | number;
  fallbackSource?: { uri: string } | number;
  showLoadingIndicator?: boolean;
  loadingIndicatorColor?: string;
  fadeDuration?: number;
  progressiveRenderingEnabled?: boolean;
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

const AvImageComponent: React.FC<AvImageProps> = ({
  style,
  containerStyle,
  imageStyle,
  priority,
  resizeMode = 'cover',
  source,
  fallbackSource,
  showLoadingIndicator = true,
  loadingIndicatorColor = COLORS.PRIMARY,
  fadeDuration = 300,
  progressiveRenderingEnabled = true,
  onError,
  onLoad,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSource, setCurrentSource] = useState(source);

  const handleError = useCallback(
    (error: any) => {
      if (!hasError && fallbackSource) {
        setHasError(true);
        setCurrentSource(fallbackSource);
      }
      onError?.(error);
    },
    [fallbackSource, onError, hasError]
  );

  const handleLoad = useCallback(
    (e: any) => {
      setIsLoading(false);
      onLoad?.(e);
    },
    [onLoad]
  );

  const imageResizeMode = useMemo(() => resizeMode, [resizeMode]);

  const imageProps = useMemo(() => {
    const props: any = {
      ...rest,
      source: currentSource,
      style: [styles.image, style, imageStyle],
      resizeMode: imageResizeMode,
      onError: handleError,
      onLoad: handleLoad,
      fadeDuration,
      progressiveRenderingEnabled,
      loadingIndicatorSource: fallbackSource,
      defaultSource: fallbackSource,
    };

    if (isIos()) {
      // @ts-ignore - iOS specific
      props.shouldRasterizeIOS = true;
    } else {
      props.fadeDuration = fadeDuration;
    }

    return props;
  }, [
    currentSource,
    style,
    imageStyle,
    imageResizeMode,
    handleError,
    handleLoad,
    rest,
    fadeDuration,
    progressiveRenderingEnabled,
    fallbackSource,
  ]);

  return (
    <View style={[styles.container, containerStyle]}>
      <RNImage {...imageProps} />
      {isLoading && showLoadingIndicator && (
        <View style={styles.loadingContainer} testID="loading-indicator">
          <ActivityIndicator size="small" color={loadingIndicatorColor} />
        </View>
      )}
    </View>
  );
};

const AvImage = React.memo(AvImageComponent);

export default AvImage;
