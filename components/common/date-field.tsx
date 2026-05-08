import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColors } from '@/hooks/use-themed-styles';

interface DateFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  placeholder?: string;
  /** Style for the touchable wrapper (typically styles.input or styles.subtaskInput). */
  style?: StyleProp<ViewStyle>;
  /** Optional minimum date. Defaults to today (no past deadlines). */
  minimumDate?: Date;
}

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function formatDeadline(date: Date): string {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86_400_000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';

  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

/**
 * Tappable field that opens a native date picker.
 * - Calendar icon + friendly label (Today / Tomorrow / weekday + date)
 * - Clear button when a date is set
 * - Past dates disabled by default (minimumDate = today)
 * - iOS: modal with Cancel / Done so the spinner dismisses predictably
 */
export function DateField({
  value,
  onChange,
  show,
  setShow,
  placeholder = 'Deadline (optional)...',
  style,
  minimumDate,
}: DateFieldProps) {
  const colors = useThemeColors();
  const minDate = minimumDate ?? startOfDay(new Date());

  // iOS spinner needs a temp value while the user scrolls; commit on Done.
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const openPicker = () => {
    setTempDate(value ?? minDate);
    setShow(true);
  };

  const handleClear = () => {
    onChange(null);
  };

  const handleAndroidChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleIOSChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) setTempDate(selectedDate);
  };

  const confirmIOS = () => {
    if (tempDate) onChange(tempDate);
    setShow(false);
  };

  const cancelIOS = () => {
    setShow(false);
  };

  const labelColor = value ? colors.text : colors.placeholder;

  return (
    <>
      <TouchableOpacity
        style={[style, styles.row]}
        onPress={openPicker}
        activeOpacity={0.7}
      >
        <Ionicons
          name="calendar-outline"
          size={18}
          color={value ? colors.secondary : colors.placeholder}
          style={styles.leadingIcon}
        />
        <ThemedText style={[styles.label, { color: labelColor }]} numberOfLines={1}>
          {value ? formatDeadline(value) : placeholder}
        </ThemedText>
        {value && (
          <Pressable
            onPress={handleClear}
            hitSlop={10}
            style={styles.clearButton}
            accessibilityLabel="Clear deadline"
          >
            <Ionicons name="close-circle" size={18} color={colors.placeholder} />
          </Pressable>
        )}
      </TouchableOpacity>

      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={value ?? minDate}
          mode="date"
          display="default"
          minimumDate={minDate}
          onChange={handleAndroidChange}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal
          visible={show}
          transparent
          animationType="fade"
          onRequestClose={cancelIOS}
        >
          <Pressable style={styles.backdrop} onPress={cancelIOS}>
            <Pressable
              style={[styles.sheet, { backgroundColor: colors.surface }]}
              onPress={() => { }}
            >
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={cancelIOS} hitSlop={8}>
                  <ThemedText style={{ color: colors.placeholder, fontSize: 16 }}>
                    Cancel
                  </ThemedText>
                </TouchableOpacity>
                <ThemedText style={{ fontSize: 16, fontWeight: '600' }}>
                  Pick a date
                </ThemedText>
                <TouchableOpacity onPress={confirmIOS} hitSlop={8}>
                  <ThemedText style={{ color: colors.secondary, fontSize: 16, fontWeight: '600' }}>
                    Done
                  </ThemedText>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate ?? minDate}
                mode="date"
                display="inline"
                minimumDate={minDate}
                onChange={handleIOSChange}
                themeVariant={colors.background === '#111820' ? 'dark' : 'light'}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadingIcon: {
    marginRight: 8,
  },
  label: {
    flex: 1,
  },
  clearButton: {
    marginLeft: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 4,
  },
});
