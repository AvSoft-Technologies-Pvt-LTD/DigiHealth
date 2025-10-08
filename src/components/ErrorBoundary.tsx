import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

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
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.errorText}>
            {error?.toString() || 'An unexpected error occurred'}
          </Text>
          {__DEV__ && errorInfo && (
            <Text style={styles.errorDetails}>
              
              {/* {errorInfo.componentStack} */}
            </Text>
          )}
          <TouchableOpacity
            style={styles.reloadButton}
            onPress={this.handleReload}
          >
            <Text style={styles.reloadButtonText}>Try Again</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.ERROR,
  },
  errorText: {
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorBoundary;
