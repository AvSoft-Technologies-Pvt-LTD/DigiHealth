import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { AvText } from '../elements';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    // Reset the error state
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Render fallback UI if provided
      if (fallback) {
        return fallback;
      }
console.log("Error Information",errorInfo)
      // Default error UI
      return (
        <View style={styles.container}>
          <AvText type='title_6' style={styles.title}>Something went wrong</AvText>
          <AvText type='heading_6' style={styles.errorText}>
            {error?.toString() || 'An unexpected error occurred'}
          </AvText>
          {/* {__DEV__ && errorInfo && (
            <AvText type='heading_6' style={styles.errorDetails}>
              
              {/* {errorInfo.componentStack} 
            </AvText>
          )} */}
          <TouchableOpacity
            style={styles.reloadButton}
            onPress={this.handleReload}
          >
            <AvText type='title_2' style={styles.reloadButtonText}>Try Again</AvText>
          </TouchableOpacity>
        </View>
      );
    }

    return children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.WHITE,
  },
  title: {
    marginBottom: 10,
    color: COLORS.ERROR,
  },
  errorText: {
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.PRIMARY_TXT,
  },
  errorDetails: {
    fontSize: 12,
    color: COLORS.GREY,
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  reloadButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  reloadButtonText: {
    color: COLORS.WHITE,
    // fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorBoundary;
