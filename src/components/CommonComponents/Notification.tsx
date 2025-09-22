import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
      icon: 'calendar'
    }
  },
  {
    id: '2',
    text: 'Appointment confirmed with Dr. Kavya Patil on 2025-10-01 at 1:00 PM',
    status: 'unread',
    type: 'General',
    timeAgo: '23 hrs ago',
    details: {
      title: 'Appointment Confirmation',
      content: 'Your appointment with Dr. Kavya Patil is confirmed for October 1, 2025, at 1:00 PM.',
      timestamp: '2025-09-03T10:00:00',
      icon: 'appointment'
    }
  },
  {
    id: '3',
    text: 'Reminder: Meeting tomorrow at 10 AM',
    status: 'read',
    type: 'General',
    timeAgo: '1 day ago',
    details: {
      title: 'Meeting Reminder',
      content: 'Don\'t forget your team meeting tomorrow at 10:00 AM in Conference Room A.',
      timestamp: '2025-09-02T09:00:00',
      icon: 'reminder'
    }
  },
];

// Notification Details Modal
interface NotificationDetailsModalProps {
  visible: boolean;
  message: Message | null;
  onClose: () => void;
}

const NotificationDetailsModal: React.FC<NotificationDetailsModalProps> = ({ visible, message, onClose }) => {
  if (!visible || !message) return null;
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.detailsModalContainer}>
          <View style={styles.detailsModalHeader}>
            <Text style={styles.detailsModalTitle}>Notification Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.detailsModalContent}>
            <View style={styles.detailsModalIcon}>
              <MaterialIcons name="notifications" size={22} color="#4a90e2" />
            </View>
            <View style={styles.detailsModalTextContainer}>
              <Text style={styles.detailsModalMetaText}>
                ● {message.type} • {message.timeAgo}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {message.details.icon === 'calendar' && (
                  <MaterialIcons name="event" size={18} color="#555" style={{ marginRight: 6 }} />
                )}
                {message.details.icon === 'appointment' && (
                  <MaterialIcons name="check-circle" size={18} color="#2e7d32" style={{ marginRight: 6 }} />
                )}
                {message.details.icon === 'reminder' && (
                  <MaterialIcons name="alarm" size={18} color="#e67e22" style={{ marginRight: 6 }} />
                )}
                <Text style={styles.detailsModalText}>{message.text}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Payment Modal
interface PaymentModalProps {
  visible: boolean;
  message: Message | null;
  onClose: () => void;
  onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ visible, message, onClose, onConfirm }) => {
  if (!visible || !message) return null;
  const doctorName = message.text.split('with ')[1]?.split(' on')[0] || 'the doctor';
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirm Payment</Text>
          <Text style={styles.modalText}>Pay ₹500 for appointment with {doctorName}?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => {
                onConfirm();
                onClose();
              }}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Main Screen
const MessagesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [messagesState, setMessagesState] = useState<Message[]>(messages);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedPaymentMessage, setSelectedPaymentMessage] = useState<Message | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filterMessages = () => {
    let filtered = [...messagesState];
    if (searchQuery) {
      filtered = filtered.filter(msg =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeTab === 'Unread') return filtered.filter(msg => msg.status === 'unread');
    if (activeTab === 'Read') return filtered.filter(msg => msg.status === 'read');
    return filtered;
  };

  const markAllAsRead = () => {
    const updated = messagesState.map(msg => ({ ...msg, status: 'read' }));
    setMessagesState(updated);
  };

  const handleMessagePress = (msg: Message) => {
    setSelectedMessage(msg);
    setDetailsModalVisible(true);
    if (msg.status === 'unread') {
      const updated = messagesState.map(m =>
        m.id === msg.id ? { ...m, status: 'read' } : m
      );
      setMessagesState(updated);
    }
  };

  const handlePayNowPress = (msg: Message) => {
    setSelectedPaymentMessage(msg);
    setPaymentModalVisible(true);
  };

  const handlePaymentConfirm = () => {
    alert("Payment of ₹500 successful!");
    const updated = messagesState.map(msg =>
      msg.id === selectedPaymentMessage?.id
        ? { ...msg, paymentStatus: 'paid' }
        : msg
    );
    setMessagesState(updated);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity onPress={() => handleMessagePress(item)}>
      <View style={styles.messageCard}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="notifications" size={22} color="#4a90e2" />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.metaRow}>
            <View style={styles.metaContainer}>
              {item.status === 'unread' && <View style={styles.unreadIndicator} />}
              <Text style={styles.messageType}>{item.type}</Text>
              <Text style={styles.metaSeparator}>•</Text>
              <Text style={styles.timestamp}>{item.timeAgo}</Text>
            </View>
            {item.id === '2' && (
              <TouchableOpacity
                style={styles.payNowButton}
                onPress={() => handlePayNowPress(item)}>
                <Text style={styles.payNowText}>Pay Now</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.messageTextWrapper}>
            {item.details.icon === 'calendar' && (
              <MaterialIcons name="event" size={18} color="#888" style={{ marginRight: 6 }} />
            )}
            {item.details.icon === 'appointment' && (
              <MaterialIcons name="check-circle" size={18} color="#2e7d32" style={{ marginRight: 6 }} />
            )}
            {item.details.icon === 'reminder' && (
              <MaterialIcons name="alarm" size={18} color="#e67e22" style={{ marginRight: 6 }} />
            )}
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Messages & Notifications</Text>
      <Text style={styles.unreadCount}>
        {messagesState.filter(msg => msg.status === 'unread').length} unread messages
      </Text>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.tabContainer}>
        {['All', 'Unread', 'Read'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {messagesState.some(msg => msg.status === 'unread') && (
        <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={filterMessages()}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages found</Text>
          </View>
        }
      />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // (same as your original styles, unchanged)
  container: { flex: 1, padding: 16, backgroundColor: '#f4f6f9' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#2c3e50' },
  unreadCount: { fontSize: 14, color: '#888', marginBottom: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: { flex: 1, height: '100%', fontSize: 16, color: '#333' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 2,
    marginBottom: 16,
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  activeTabButton: {
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: { fontSize: 15, fontWeight: '500', color: '#6c757d' },
  activeTabText: { color: '#2c3e50', fontWeight: '600' },
  markAllButton: { backgroundColor: '#000', paddingVertical: 12, borderRadius: 8, marginBottom: 16 },
  markAllText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  listContent: { paddingBottom: 20 },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#141a22',
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e7f5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: { flex: 1 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  metaContainer: { flexDirection: 'row', alignItems: 'center' },
  unreadIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'black', marginRight: 8 },
  messageType: { fontSize: 13, color: '#666', fontWeight: '600', textTransform: 'uppercase' },
  metaSeparator: { marginHorizontal: 5, color: '#999', fontSize: 14 },
  timestamp: { fontSize: 13, color: '#999' },
  messageTextWrapper: { flexDirection: 'row', alignItems: 'center' },
  messageText: { fontSize: 15, color: '#2c3e50', lineHeight: 22 },
  payNowButton: { backgroundColor: '#28a745', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12 },
  payNowText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: '#666' },
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  detailsModalContainer: { width: '90%', maxWidth: 400, backgroundColor: 'white', borderRadius: 12, overflow: 'hidden' },
  detailsModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  detailsModalTitle: { fontSize: 18, fontWeight: '600', color: '#2c3e50' },
  closeButton: { padding: 4 },
  detailsModalContent: { padding: 16, flexDirection: 'row', alignItems: 'flex-start' },
  detailsModalIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eaf2fe', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  detailsModalTextContainer: { flex: 1 },
  detailsModalMetaText: { fontSize: 13, color: '#6c757d', marginBottom: 6, textTransform: 'uppercase' },
  detailsModalText: { fontSize: 16, color: '#2c3e50', lineHeight: 22 },
  modalContainer: { width: '85%', backgroundColor: 'white', borderRadius: 12, padding: 24, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#2c3e50', marginBottom: 10 },
  modalText: { fontSize: 16, color: '#555', marginBottom: 20, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#e0e0e0' },
  confirmButton: { backgroundColor: '#2e7d32' },
  cancelButtonText: { color: '#555', fontWeight: '600' },
  confirmButtonText: { color: '#fff', fontWeight: '600' },
});

const NotificationsScreen: React.FC = () => <MessagesScreen />;
export default NotificationsScreen;
