import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Typography } from '../../constants/fonts';
import { normalize, widthPercentageToDP } from '../../constants/platform';
import { AvText, AvTextInput , AvIcons, AvModal} from '../../elements';
import { width } from '../../constants/common';

// Define types
type MessageType = 'General' | string;
type MessageStatus = 'read' | 'unread';
type IconType = 'calendar' | 'appointment' | 'reminder' | string;

interface MessageDetails {
  title: string;
  content: string;
  timestamp: string;
  icon: IconType;
}

interface Message {
  id: string;
  text: string;
  status: MessageStatus;
  type: MessageType;
  timeAgo: string;
  details: MessageDetails;
  paymentStatus?: string;
}

// Sample data
const messages: Message[] = [
  {
    id: '1',
    text: 'Rescheduled to 2025-09-04 at 17:26',
    status: 'unread',
    type: 'General',
    timeAgo: '22 hrs ago',
    details: {
      title: 'Calendar Notification',
      content: 'Your appointment has been rescheduled to September 4, 2025, at 5:26 PM.',
      timestamp: '2025-09-03T17:26:00',
      icon: 'calendar',
    },
  },
  {
    id: '2',
    text: 'Appointment confirmed with Dr. Kavya Patil on 2025-10-01 ',
    status: 'unread',
    type: 'General',
    timeAgo: '23 hrs ago',
    details: {
      title: 'Appointment Confirmation',
      content: 'Your appointment with Dr. Kavya Patil is confirmed for October 1, 2025, at 1:00 PM.',
      timestamp: '2025-09-03T10:00:00',
      icon: 'appointment',
    },
  },
  {
    id: '3',
    text: 'Reminder: Meeting tomorrow at 10 AM',
    status: 'read',
    type: 'General',
    timeAgo: '1 day ago',
    details: {
      title: 'Meeting Reminder',
      content: "Don't forget your team meeting tomorrow at 10:00 AM in Conference Room A.",
      timestamp: '2025-09-02T09:00:00',
      icon: 'reminder',
    },
  },
];

// Notification Details Modal
interface NotificationDetailsModalProps {
  visible: boolean;
  message: Message | null;
  onClose: () => void;
}

const NotificationDetailsModal: React.FC<NotificationDetailsModalProps> = ({
  visible,
  message,
  onClose,
}) => {
  if (!visible || !message) return null;
  return (
    <AvModal isModalVisible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.detailsModalContainer}>
          <View style={styles.detailsModalHeader}>
            <AvText style={[Typography.heading_5, styles.detailsModalTitle]}>Notification Details</AvText>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <AvIcons
                type={"MaterialIcons"}
                name={"close"}
                size={normalize(22)}
                color={COLORS.GREY}
              />
            </Pressable>
          </View>
          <View style={styles.detailsModalContent}>
            <View style={styles.detailsModalIcon}>
              <AvIcons
                type={"MaterialIcons"}
                name={"notifications"}
                size={normalize(22)}
                color={COLORS.PRIMARY_BLUE}
              />
            </View>
            <View style={styles.detailsModalTextContainer}>
              <AvText type='body' style={[styles.detailsModalMetaText]}>
                ● {message.type} • {message.timeAgo}
              </AvText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {message.details.icon === 'calendar' && (
                  <AvIcons
                    type={"MaterialIcons"}
                    name="event"
                    size={normalize(18)}
                    color={COLORS.GREY}
                    style={{ marginRight: normalize(6) }}
                  />
                )}
                {message.details.icon === 'appointment' && (
                  <AvIcons
                    type={"MaterialIcons"}
                    name="check-circle"
                    size={normalize(18)}
                    color={COLORS.SUCCESS}
                    style={{ marginRight: normalize(6) }}
                  />
                )}
                {message.details.icon === 'reminder' && (
                  <AvIcons
                    type={"MaterialIcons"}
                    name="alarm"
                    size={normalize(18)}
                    color={COLORS.ORANGE}
                    style={{ marginRight: normalize(6) }}
                  />
                )}
                <AvText type='body' style={[styles.detailsModalText]}>{message.text}</AvText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </AvModal>
  );
};

// Payment Modal
interface PaymentModalProps {
  visible: boolean;
  message: Message | null;
  onClose: () => void;
  onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  message,
  onClose,
  onConfirm,
}) => {
  if (!visible || !message) return null;
  const doctorName = message.text.split('with ')[1]?.split(' on')[0] || 'the doctor';
  return (
    <AvModal isModalVisible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <AvText type='heading_4' style={[styles.modalTitle]}>Confirm Payment</AvText>
          <AvText type='body' style={[styles.modalText]}>Pay ₹500 for appointment with {doctorName}?</AvText>
          <View style={styles.modalButtons}>
            <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
              <AvText type='buttonText' style={[styles.cancelButtonText]}>Cancel</AvText>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => {
                onConfirm();
                onClose();
              }}>
              <AvText type='buttonText' style={[styles.confirmButtonText]}>Confirm</AvText>
            </Pressable>
          </View>
        </View>
      </View>
    </AvModal>
  );
};

// Main Screen
const MessagesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Read'>('All');
  const [messagesState, setMessagesState] = useState<Message[]>(messages);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  
  // Animation values
  const tabIndicatorAnimation = useRef(new Animated.Value(0)).current;
  const tabContentAnimation = useRef(new Animated.Value(1)).current;
  
  // Initialize animation on mount
  useEffect(() => {
    const tabIndexes = { All: 0, Unread: 1, Read: 2 };
    tabIndicatorAnimation.setValue(tabIndexes[activeTab]);
  }, []);
  
  // Handle tab change with animation
  const handleTabChange = (tab: 'All' | 'Unread' | 'Read') => {
    if (tab === activeTab) return;
    
    // Animate content fade out
    Animated.timing(tabContentAnimation, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Change tab
      setActiveTab(tab);
      
      // Animate indicator slide
      const tabIndexes = { All: 0, Unread: 1, Read: 2 };
      Animated.spring(tabIndicatorAnimation, {
        toValue: tabIndexes[tab],
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
      
      // Animate content fade in
      Animated.timing(tabContentAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };
  const [selectedPaymentMessage, setSelectedPaymentMessage] = useState<Message | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filterMessages = (): Message[] => {
    let filtered = [...messagesState];
    if (searchQuery) {
      filtered = filtered.filter((msg) =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeTab === 'Unread') return filtered.filter((msg) => msg.status === 'unread');
    if (activeTab === 'Read') return filtered.filter((msg) => msg.status === 'read');
    return filtered;
  };

  const markAllAsRead = () => {
    const updated: Message[] = messagesState.map(msg => ({
      ...msg,
      status: 'read' as const
    }));
    setMessagesState(updated);
  };

  const handleMessagePress = (msg: Message) => {
    setSelectedMessage(msg);
    setDetailsModalVisible(true);
    if (msg.status === 'unread') {
      const updated: Message[] = messagesState.map(m =>
        m.id === msg.id ? { ...m, status: 'read' as const } : m
      );
      setMessagesState(updated);
    }
  };

  const handlePayNowPress = (msg: Message) => {
    setSelectedPaymentMessage(msg);
    setPaymentModalVisible(true);
  };

  const handlePaymentConfirm = () => {
    Alert.alert(
      "Payment Successful",
      "Payment of ₹500 has been processed successfully!",
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed")
        }
      ]
    );

    const updated: Message[] = messagesState.map(msg =>
      msg.id === selectedPaymentMessage?.id
        ? { ...msg, paymentStatus: 'paid' }
        : msg
    );
    setMessagesState(updated);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <Pressable onPress={() => handleMessagePress(item)}>
      <View style={styles.messageCard}>
        <View style={styles.iconContainer}>
          <AvIcons
            type={"MaterialIcons"}
            name={
              item.details.icon === 'calendar'
                ? 'calendar-today'
                : item.details.icon === 'appointment'
                ? 'event'
                : 'notifications'
            }
            size={normalize(16)}
            color={COLORS.PRIMARY_BLUE}
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.metaRow}>
            <View style={styles.metaContainer}>
              {item.status === 'unread' && (
                <View style={styles.unreadIndicator} />
              )}
              <AvText type='body' style={[styles.messageType]}>{item.type}</AvText>
              <AvText type='body' style={[styles.metaSeparator]}>•</AvText>
              <AvText type='body' style={[styles.timestamp]}>{item.timeAgo}</AvText>
            </View>
            {item.id === '2' && (
              <Pressable
                style={styles.payNowButton}
                onPress={() => handlePayNowPress(item)}>
                <AvText type='title_5' style={[styles.payNowText]}>Pay Now</AvText>
              </Pressable>
            )}
          </View>
          <View style={styles.messageTextWrapper}>
            {item.details.icon === 'calendar' && (
              <AvIcons
                type={"MaterialIcons"}
                name={"calendar-today"}
                size={normalize(14)}
                color={COLORS.PRIMARY_BLUE}
                style={{ marginRight: normalize(6) }}
              />
            )}
            <AvText type='body' style={[styles.messageText]}>{item.text}</AvText>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <>
      <AvText type='heading_4' style={[styles.headerTitle]}>Messages & Notifications</AvText>
      <AvText type='body' style={[styles.unreadCount]}>
        {messagesState.filter(msg => msg.status === 'unread').length} unread messages
      </AvText>

      <View style={styles.searchContainer}>
        <AvIcons
          type={"MaterialIcons"}
          name="search"
          size={normalize(20)}
          color={COLORS.GREY}
          style={{ marginRight: normalize(8) }}
        />
        
        <AvTextInput
          style={[Typography.body, styles.searchInput]}
          placeholder="Search messages..."
          placeholderTextColor={COLORS.GREY}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <Animated.View 
          style={[
            styles.tabIndicator,
            {
              transform: [{
                translateX: tabIndicatorAnimation.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [0, widthPercentageToDP(33.33), widthPercentageToDP(66.66)],
                })
              }]
            }
          ]}
        />
        {(['All', 'Unread', 'Read'] as const).map(tab => (
          <Pressable
            key={tab}
            onPress={() => handleTabChange(tab)}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}>
            <AvText type='title_3' style={[activeTab === tab ? styles.activeTabText : styles.tabText]}>
              {tab}
            </AvText>
          </Pressable>
        ))}
      </View>

      <Animated.View style={{ opacity: tabContentAnimation }}>
        <FlatList
          data={filterMessages()}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AvText type='title_2' style={[styles.emptyText]}>No messages found</AvText>
            </View>
          }
        />
      </Animated.View>

      <NotificationDetailsModal
        visible={detailsModalVisible}
        message={selectedMessage}
        onClose={() => setDetailsModalVisible(false)}
      />

      <PaymentModal
        visible={paymentModalVisible}
        message={selectedPaymentMessage}
        onClose={() => {
          setPaymentModalVisible(false);
          setSelectedPaymentMessage(null);
        }}
        onConfirm={handlePaymentConfirm}
      />
    </>
  );
};

// Styles with normalize applied
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: normalize(18),
    padding: normalize(16),
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  headerTitle: {
    marginBottom: normalize(8),
    color: COLORS.PRIMARY,
  },
  unreadCount: {
    color: COLORS.GREY,
    marginBottom: normalize(20),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: normalize(48),
    borderRadius: normalize(8),
    backgroundColor: COLORS.TRANSPARENT,
    paddingHorizontal: normalize(12),
    marginBottom: normalize(16),
    borderWidth: 0,
    borderColor: COLORS.LIGHT_GREY,
  },
  searchInput: {
    flex: 1,
    height: normalize(48),
    fontSize: normalize(16),
    color: COLORS.PRIMARY,
    marginTop: normalize(16),
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    padding: normalize(2),
    marginBottom: normalize(16),
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: normalize(0),
    left: normalize(2),
    width: widthPercentageToDP(24),
    height: normalize(36),
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(6),
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.1,
    shadowRadius: normalize(4),
    shadowOffset: { width: 0, height: normalize(2) },
    elevation: 3,
    zIndex: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: normalize(10),
    alignItems: 'center',
    borderRadius: normalize(6),
    zIndex: 2,
  },
  activeTabButton: {
    backgroundColor: COLORS.TRANSPARENT,
    shadowColor: COLORS.TRANSPARENT,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  tabText: {
    fontWeight: '500',
    color: COLORS.GREY,
    zIndex: 3,
  },
  activeTabText: {
    color: COLORS.PRIMARY,
    fontWeight: '500',
    zIndex: 3,
  },
  markAllButton: {
    backgroundColor: COLORS.BLACK,
    paddingVertical: normalize(12),
    borderRadius: normalize(8),
    marginBottom: normalize(16),
  },
  markAllText: {
    color: COLORS.WHITE,
    fontSize: normalize(16),
    fontWeight: '600',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: normalize(20),
  },
  messageCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(12),
    padding: normalize(16),
    marginBottom: normalize(12),
    flexDirection: 'row',
    borderLeftWidth: normalize(4),
    borderLeftColor: COLORS.PRIMARY,
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.1,
    shadowRadius: normalize(4),
    shadowOffset: { width: 0, height: normalize(2) },
    elevation: 3,
  },
  iconContainer: {
    width: normalize(30),
    height: normalize(30),
    borderRadius: normalize(20),
    backgroundColor: COLORS.PRIMARY_BACKGROND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
  },
  contentContainer: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadIndicator: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: COLORS.BLACK,
    marginRight: normalize(8),
  },
  messageType: {
    fontSize: normalize(13),
    color: COLORS.GREY,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metaSeparator: {
    marginHorizontal: normalize(5),
    color: COLORS.GREY,
    fontSize: normalize(14),
  },
  timestamp: {
    fontSize: normalize(10),
    color: COLORS.GREY,
  },
  messageTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    fontSize: normalize(13),
    color: COLORS.PRIMARY,
    lineHeight: normalize(22),
    marginRight: normalize(8)
  },
  payNowButton: {
    backgroundColor: COLORS.SUCCESS,
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(12),
  },
  payNowText: {
    fontSize: normalize(13),
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
  },
  emptyText: {

    color: COLORS.GREY,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  detailsModalContainer: {
    width: width-50,
    maxWidth: normalize(400),
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(12),
    overflow: 'scroll',
  },
  detailsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.DIVIDER,
  },
  detailsModalTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  closeButton: {
    padding: normalize(4),
  },
  detailsModalContent: {
    padding: normalize(16),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailsModalIcon: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: COLORS.PRIMARY_BACKGROND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
  },
  detailsModalTextContainer: {
    flex: 1,
  },
  detailsModalMetaText: {
    fontSize: normalize(13),
    color: COLORS.GREY,
    marginBottom: normalize(6),
    textTransform: 'uppercase',
  },
  detailsModalText: {
    fontSize: normalize(16),
    color: COLORS.PRIMARY,
    lineHeight: normalize(22),
  },
  modalContainer: {
    width: widthPercentageToDP(85),
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(12),
    padding: normalize(24),
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: normalize(20),
    fontWeight: '700',
    color: COLORS.PRIMARY,
    marginBottom: normalize(10),
  },
  modalText: {
    fontSize: normalize(16),
    color: COLORS.GREY,
    marginBottom: normalize(20),
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: normalize(12),
    borderRadius: normalize(8),
    alignItems: 'center',
    marginHorizontal: normalize(5),
  },
  cancelButton: {
    backgroundColor: COLORS.LIGHT_GREY,
  },
  confirmButton: {
    backgroundColor: COLORS.SUCCESS,
  },
  cancelButtonText: {
    fontSize: normalize(16),
    color: COLORS.GREY,
    fontWeight: '600',
  },
  confirmButtonText: {
    fontSize: normalize(16),
    color: COLORS.WHITE,
    fontWeight: '600',
  },
});

const NotificationsScreen: React.FC = () => <MessagesScreen />;
export default React.memo(NotificationsScreen);
