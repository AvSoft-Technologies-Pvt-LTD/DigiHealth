import React from 'react';
import { View, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import AvText from '../../elements/AvText';
import { COLORS } from '../../constants/colors';

export interface DataRecord {
  recordId: string;
  isHidden: boolean;
  [key: string]: any;
}

export interface Action {
  key: string;
  onPress: (record: DataRecord) => void;
  render?: (record: DataRecord) => React.ReactNode;
}

export interface DynamicCardTableProps {
  data: DataRecord[];
  headerFields?: string[];
  actions?: Action[];
  onCardPress?: (record: DataRecord) => void;
}

export function TableCard({
  data,
  headerFields = [],
  actions = [],
  onCardPress,
}: DynamicCardTableProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <AvText type="heading_1" style={styles.emptyIcon}>📋</AvText>
        </View>
        <AvText type="title_1" style={styles.emptyTitle}>No Records Found</AvText>
        <AvText type="body" style={styles.emptySubtitle}>
          There are no data records to display at this time
        </AvText>
      </View>
    );
  }

  const renderFieldValue = (key: string, value: any, isInTwoColumn: boolean = false) => {
    if (key === 'recordId' || key === 'isHidden') {
      return null;
    }
    const formatFieldLabel = (fieldKey: string) => {
      return fieldKey
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
    };
    const formatFieldValue = (val: any) => {
      if (val === null || val === undefined) return '-';
      if (typeof val === 'boolean') return val ? 'Yes' : 'No';
      if (typeof val === 'number') {
        if (key.toLowerCase().includes('price') || key.toLowerCase().includes('salary')) {
          return `$${val.toLocaleString()}`;
        }
        return val.toLocaleString();
      }
      return val.toString();
    };
    return (
      <View key={key} style={isInTwoColumn ? styles.fieldColumn : styles.fieldRow}>
        <AvText type="caption" style={styles.fieldLabel}>{formatFieldLabel(key)}</AvText>
        <AvText type="body" style={[styles.fieldValue, ...(isInTwoColumn ? [styles.fieldValueColumn] : [])]}>
          {formatFieldValue(value)}
        </AvText>
      </View>
    );
  };

  const renderFieldsInColumns = (record: DataRecord) => {
    // Filter out headerFields, recordId, isHidden, and id
    const fields = Object.entries(record).filter(
      ([key]) => !headerFields.includes(key) && key !== 'recordId' && key !== 'isHidden' && key !== 'id'
    );
    const columns = [];
    for (let i = 0; i < fields.length; i += 2) {
      const leftField = fields[i];
      const rightField = fields[i + 1];
      columns.push(
        <View key={i} style={styles.twoColumnRow}>
          <View style={styles.columnContainer}>
            {renderFieldValue(leftField[0], leftField[1], true)}
          </View>
          {rightField && (
            <View style={styles.columnContainer}>
              {renderFieldValue(rightField[0], rightField[1], true)}
            </View>
          )}
        </View>
      );
    }
    return columns;
  };

 const renderHeaderContent = (record: DataRecord) => {
  return (
    <View style={styles.headerContentContainer}>
      {headerFields.map((field) => (
        <View key={field} style={styles.headerFieldContainer}>
          <AvText type="body" style={styles.headerFieldValue} numberOfLines={1} ellipsizeMode="tail">
            {record[field] || '-'}
          </AvText>
        </View>
      ))}
    </View>
  );
};
  const renderHeaderActions = (record: DataRecord) => {
    return (
      <View style={styles.actionsContainer}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.key}
            style={styles.actionButton}
            onPress={() => action.onPress(record)}
          >
            {action.render ? action.render(record) : null}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {data.map((record) => (
        <TouchableOpacity
          key={record.recordId}
          style={[
            styles.card,
            record.isHidden && styles.hiddenCard,
          ]}
          activeOpacity={0.8}
          onPress={() => onCardPress?.(record)}
        >
          {/* Dynamic Header with Record ID, Content, and Actions */}
          <View style={styles.cardHeader}>
            <View style={styles.recordIdContainer}>
              <View style={styles.idBadge}>
                <AvText type="heading_6" style={styles.recordIdLabel}>#{record.recordId}</AvText>
              </View>
            </View>
            {renderHeaderContent(record)}
            {renderHeaderActions(record)}
          </View>
          {/* Dynamic Fields in Two Columns (excluding header fields) */}
          <View style={styles.fieldsContainer}>
            {renderFieldsInColumns(record)}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 14,
    marginBottom: 6,
    shadowColor: COLORS.OCEAN_BLUE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    transform: [{ scale: 1 }],
  },
  hiddenCard: {
    opacity: 0.5,
    borderColor: COLORS.LIGHT_GREY,
    backgroundColor: COLORS.OFFWHITE,
    shadowOpacity: 0.06,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  recordIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  idBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
  },
  recordIdLabel: {
    fontSize: 16,
    fontWeight: '200',
    color: COLORS.SECONDARY,
    letterSpacing: -0.2,
  },
    headerContentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the start (top-left)
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start', // Align content to the start (left)
  },
  headerFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 34,
  },
  headerFieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.GREY,
    marginBottom: 2,
  },
  headerFieldValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.PRIMARY_TXT,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  fieldsContainer: {
    gap: 16,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 16,
  },
  columnContainer: {
    flex: 1,
  },
  fieldColumn: {
    padding: 5,
    paddingLeft: 15,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.GREY,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY_TXT,
    textAlign: 'right',
    flex: 1,
    letterSpacing: -0.2,
  },
  fieldValueColumn: {
    textAlign: 'left',
    flex: 0,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.LIGHT_GREY,
    paddingLeft: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
    marginVertical: 64,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.PRIMARY_BACKGROND,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY_BLUE,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.PRIMARY,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.GREY,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    letterSpacing: 0.1,
  },
});