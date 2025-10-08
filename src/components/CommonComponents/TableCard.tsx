import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AvText from '../../elements/AvText';
import { COLORS } from '../../constants/colors';
import { normalize } from '../../constants/platform';

export interface DataRecord {
  recordId: string;
  isHidden?: boolean;
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
  bodyFields?: string[];
  topRightFields?: string[];
  actions?: Action[];
  onCardPress?: (record: DataRecord) => void;
  fieldRenderers?: Record<string, (record: DataRecord) => React.ReactNode>; // ✅ added
}

export function TableCard({
  data,
  headerFields = [],
  bodyFields = [],
  topRightFields = [],
  actions = [],
  onCardPress,
  fieldRenderers = {}, // ✅ default empty
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

  const formatFieldLabel = (fieldKey: string) =>
    fieldKey
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

  const formatFieldValue = (val: any, key: string) => {
    if (val === null || val === undefined) return '-';
    if (typeof val === 'boolean') return val ? 'yes' : 'no';
    if (typeof val === 'number') {
      if (
        key.toLowerCase().includes('price') ||
        key.toLowerCase().includes('salary') ||
        key.toLowerCase().includes('total')
      ) {
        return `$${val.toLocaleString()}`;
      }
      return val.toLocaleString();
    }
    return val.toString();
  };

  // ✅ Centralized function to use fieldRenderers when available
  const renderFieldValue = (record: DataRecord, key: string) => {
    if (fieldRenderers[key]) {
      return fieldRenderers[key](record); // custom render (colored status, etc.)
    }
    return (
      <AvText style={styles.fieldValue} numberOfLines={1} ellipsizeMode="tail">
        {formatFieldValue(record[key], key)}
      </AvText>
    );
  };

  const getFieldWidth = (key: string, value: any) => {
    const stringValue = formatFieldValue(value, key);
    if (stringValue.length > 20) return 'full';
    if (stringValue.length > 10) return 'medium';
    return 'short';
  };

  const arrangeFieldsInRows = (fields: [string, any][]) => {
    const rows: [string, any][][] = [];
    let currentRow: [string, any][] = [];
    let currentRowWidth = 0;

    fields.forEach(([key, value]) => {
      const fieldWidth = getFieldWidth(key, value);
      let widthValue = fieldWidth === 'full' ? 2 : fieldWidth === 'medium' ? 1.5 : 1;

      if (currentRowWidth + widthValue > 2 || (currentRow.length > 0 && fieldWidth === 'full')) {
        rows.push([...currentRow]);
        currentRow = [[key, value]];
        currentRowWidth = widthValue;
      } else {
        currentRow.push([key, value]);
        currentRowWidth += widthValue;
      }
    });

    if (currentRow.length > 0) rows.push(currentRow);

    return rows;
  };

  const renderHeaderContent = (record: DataRecord) => {
    if (headerFields.length === 0) return null;
    return (
      <View style={styles.headerContent}>
        {headerFields.map((field) => (
          <View key={field} style={styles.headerField}>
            {renderFieldValue(record, field)}
          </View>
        ))}
      </View>
    );
  };

  const renderTopRightFields = (record: DataRecord) => {
    if (!topRightFields || topRightFields.length === 0) return null;
    return (
      <View style={styles.topRightFieldsContainer}>
        {topRightFields.map((field) => (
          <View key={field} style={styles.topRightField}>
            {renderFieldValue(record, field)}
          </View>
        ))}
      </View>
    );
  };

  const renderBodyFields = (record: DataRecord) => {
    const allFields = Object.entries(record).filter(
      ([key]) =>
        !headerFields.includes(key) &&
        key !== 'recordId' &&
        key !== 'isHidden' &&
        key !== 'id' &&
        (!bodyFields.length || bodyFields.includes(key)) &&
        !topRightFields.includes(key)
    );
    const fieldRows = arrangeFieldsInRows(allFields);

    return (
      <View style={styles.bodyContent}>
        {fieldRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.fieldRow}>
            {row.map(([key, value]) => {
              const fieldWidth = getFieldWidth(key, value);
              const isFullWidth = fieldWidth === 'full' || row.length === 1;
              return (
                <View
                  key={key}
                  style={[
                    styles.fieldContainer,
                    isFullWidth ? styles.fullWidthField : styles.halfWidthField,
                  ]}
                >
                  <AvText style={styles.fieldLabel}>{formatFieldLabel(key)}</AvText>
                  {renderFieldValue(record, key)}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const renderActions = (record: DataRecord) => {
    if (actions.length === 0) return null;
    return (
      <View style={styles.actionsContainer}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.key}
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              action.onPress(record);
            }}
          >
            {action.render ? (
              action.render(record)
            ) : (
              <AvText style={styles.actionText}>{action.key.toLowerCase()}</AvText>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {data.map((record) => (
        <TouchableOpacity
          key={record.recordId}
          style={[styles.card, record.isHidden && styles.hiddenCard]}
          activeOpacity={0.95}
          onPress={() => onCardPress?.(record)}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.recordIdBadge}>
                <AvText style={styles.recordIdText}>#{record.recordId}</AvText>
              </View>
              {renderHeaderContent(record)}
            </View>
            {actions.length > 0 && (
              <View style={styles.headerActionsContainer}>{renderActions(record)}</View>
            )}
          </View>

          {/* Top-Right Fields */}
          {renderTopRightFields(record)}

          {/* Card Body */}
          {renderBodyFields(record)}

          {/* Hidden overlay */}
          {record.isHidden && (
            <View style={styles.hiddenOverlay}>
              <AvText style={styles.hiddenText}>hidden</AvText>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: normalize(4) },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(20),
    marginBottom: normalize(4),
    shadowOpacity: 0.08,
    shadowRadius: normalize(12),
    elevation: 6,
    borderWidth: 0,
    borderTopWidth: normalize(4),
    borderTopColor: COLORS.PRIMARY,
    overflow: 'hidden',
    position: 'relative',
  },
  hiddenCard: { opacity: 0.7, shadowOpacity: 0.03 },
  cardHeader: {
    paddingTop: normalize(10),
    paddingHorizontal: normalize(10),
    paddingBottom: normalize(2),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: normalize(2), flex: 1 },
  recordIdBadge: {
    paddingHorizontal: normalize(4),
    paddingVertical: normalize(4),
    borderRadius: normalize(6),
    borderWidth: 2,
    borderColor: COLORS.LIGHT_GREY,
  },
  recordIdText: { fontSize: normalize(12), fontWeight: '700', letterSpacing: -0.3 },
  headerContent: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: normalize(8), padding: normalize(6) },
  headerField: { gap: normalize(2) },
  headerActionsContainer: { flexDirection: 'row', gap: normalize(8) },
  topRightFieldsContainer: {
    position: 'absolute',
    top: normalize(60),
    right: normalize(8),
    flexDirection: 'column',
    gap: normalize(6),
    zIndex: 1,
  },
  topRightField: { paddingHorizontal: normalize(8), minWidth: normalize(80), alignItems: 'center' },
  bodyContent: { padding: normalize(20), paddingTop: normalize(16), gap: normalize(14) },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  fieldContainer: { gap: normalize(4) },
  fullWidthField: { flex: 1 },
  halfWidthField: { flex: 0.48 },
  fieldLabel: { fontSize: normalize(12), fontWeight: '500', color: COLORS.GREY, marginBottom: normalize(2) },
  fieldValue: { fontSize: normalize(15), fontWeight: '600', color: COLORS.PRIMARY_TXT, lineHeight: normalize(20) },
  actionsContainer: { flexDirection: 'row', gap: normalize(8) },
  actionButton: { paddingHorizontal: normalize(4), paddingVertical: normalize(2), alignItems: 'center', justifyContent: 'center' },
  actionText: { fontSize: normalize(12), fontWeight: '500', color: COLORS.PRIMARY },
  hiddenOverlay: {
    position: 'absolute',
    top: normalize(8),
    right: normalize(12),
    backgroundColor: COLORS.WARNING,
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(8),
  },
  hiddenText: { color: COLORS.WHITE, fontSize: normalize(9), fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: normalize(48), marginVertical: normalize(64) },
  emptyIconContainer: {
    width: normalize(96),
    height: normalize(96),
    borderRadius: normalize(48),
    backgroundColor: COLORS.PRIMARY_BACKGROND,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(24),
    borderWidth: 2,
    borderColor: COLORS.PRIMARY_BLUE,
  },
  emptyIcon: { fontSize: normalize(40) },
  emptyTitle: { fontSize: normalize(22), fontWeight: '800', color: COLORS.PRIMARY, marginBottom: normalize(12), textAlign: 'center', letterSpacing: -0.3 },
  emptySubtitle: {
    fontSize: normalize(16),
    color: COLORS.GREY,
    textAlign: 'center',
    lineHeight: normalize(24),
    maxWidth: normalize(300),
    letterSpacing: 0.1,
  },
});