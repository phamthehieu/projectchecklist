import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useAppColorMode } from '../ColorModeContext';

// Lấy kích thước màn hình
const { width, height } = Dimensions.get('window');

interface IProps {
  loading: boolean;
  title?: string;
  size?: "large" | "small";
}

const MSpinner: React.FC<IProps> = ({
  loading,
  title = "Please Wait",
  size = "large"
}) => {

  const { colorMode } = useAppColorMode();

  return (
    <>
      {loading && (
        <View style={styles.content}>
          <View style={[styles.box, { backgroundColor: colorMode === "light" ? "#0000009C" : "#FFFFFF" }]}>
            <ActivityIndicator
              size="large"
              color={colorMode === "light" ? "#FFFFFF" : "#0176FF"}
            />
            {!!title && (
              <Text
                style={{
                  paddingHorizontal: 16,
                  textAlign: 'center',
                  marginTop: 8,
                  fontSize: 14,
                  color: colorMode === "light" ? "#FFFFFF" : "#0176FF",
                }}>
                {title}
              </Text>
            )}
          </View>
        </View>
      )}
    </>
  );
};

export default MSpinner;

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    minWidth: 100,
    borderRadius: 12,
    maxWidth: (width * 2) / 3,
  },
});

