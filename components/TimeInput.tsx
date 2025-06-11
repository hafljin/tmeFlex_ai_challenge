import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useSettings } from '@/hooks/useSettings';

interface TimeInputProps {
  onTimeSet: (seconds: number) => void;
}

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 3;
const SCROLL_VIEW_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export default function TimeInput({ onTimeSet }: TimeInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const { theme, setHeaderVisible } = useSettings();
  
  const hoursScrollRef = useRef<ScrollView>(null);
  const minutesScrollRef = useRef<ScrollView>(null);
  const secondsScrollRef = useRef<ScrollView>(null);
  
  // スクロール位置の更新を制御するフラグ
  const [isUpdatingScroll, setIsUpdatingScroll] = useState(false);
  
  const isDark = theme === 'dark';
  const styles = createStyles(isDark);

  // ピッカー表示時にヘッダーを非表示にする
  useEffect(() => {
    setHeaderVisible(!showPicker);
  }, [showPicker, setHeaderVisible]);

  // スクロール位置を中央に調整する関数
  const scrollToCenter = (scrollViewRef: React.RefObject<ScrollView | null>, value: number) => {
    if (isUpdatingScroll) return;
    
    setIsUpdatingScroll(true);
    const yOffset = value * ITEM_HEIGHT;
    scrollViewRef.current?.scrollTo({
      y: yOffset,
      animated: true,
    });
    
    // スクロールアニメーション完了後にフラグをリセット
    setTimeout(() => {
      setIsUpdatingScroll(false);
    }, 300);
  };

  // 初期表示時のスクロール位置設定
  useEffect(() => {
    if (showPicker && !isUpdatingScroll) {
      setTimeout(() => {
        setIsUpdatingScroll(true);
        scrollToCenter(hoursScrollRef, hours);
        scrollToCenter(minutesScrollRef, minutes);
        scrollToCenter(secondsScrollRef, seconds);
        setTimeout(() => {
          setIsUpdatingScroll(false);
        }, 500);
      }, 100);
    }
  }, [showPicker]);

  const handleTimeSet = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds > 0) {
      onTimeSet(totalSeconds);
      setShowPicker(false);
      // Reset values
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
  };

  const handleCancel = () => {
    setShowPicker(false);
    // Reset values
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  // 各ピッカーの値変更ハンドラー
  const handleHoursChange = (newHours: number) => {
    if (!isUpdatingScroll) {
      setHours(newHours);
      scrollToCenter(hoursScrollRef, newHours);
    }
  };

  const handleMinutesChange = (newMinutes: number) => {
    if (!isUpdatingScroll) {
      setMinutes(newMinutes);
      scrollToCenter(minutesScrollRef, newMinutes);
    }
  };

  const handleSecondsChange = (newSeconds: number) => {
    if (!isUpdatingScroll) {
      setSeconds(newSeconds);
      scrollToCenter(secondsScrollRef, newSeconds);
    }
  };

  if (!showPicker) {
    return (
      <TouchableOpacity 
        style={styles.customTimeButton}
        onPress={() => setShowPicker(true)}
      >
        <Clock size={20} color="#6366f1" />
        <Text style={styles.customTimeText}>Custom Time</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Modal
      visible={showPicker}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Set Custom Time</Text>
          
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>
              {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
            </Text>
          </View>

          <View style={styles.pickerRow}>
            {/* Hours Picker */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerColumnLabel}>Hours</Text>
              <View style={styles.pickerWrapper}>
                <ScrollView 
                  ref={hoursScrollRef}
                  style={styles.pickerScrollView}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={(event) => {
                    if (!isUpdatingScroll) {
                      const y = event.nativeEvent.contentOffset.y;
                      const selectedIndex = Math.round(y / ITEM_HEIGHT);
                      if (selectedIndex !== hours) {
                        handleHoursChange(selectedIndex);
                      }
                    }
                  }}
                >
                  {/* 上部の空白 */}
                  <View style={{ height: ITEM_HEIGHT }} />
                  {Array.from({ length: 25 }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.pickerItem,
                        hours === i && styles.pickerItemSelected
                      ]}
                      onPress={() => handleHoursChange(i)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        hours === i && styles.pickerItemTextSelected
                      ]}>
                        {i.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {/* 下部の空白 */}
                  <View style={{ height: ITEM_HEIGHT }} />
                </ScrollView>
                <View style={styles.pickerSelectionIndicator} />
              </View>
            </View>

            {/* Minutes Picker */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerColumnLabel}>Minutes</Text>
              <View style={styles.pickerWrapper}>
                <ScrollView 
                  ref={minutesScrollRef}
                  style={styles.pickerScrollView}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={(event) => {
                    if (!isUpdatingScroll) {
                      const y = event.nativeEvent.contentOffset.y;
                      const selectedIndex = Math.round(y / ITEM_HEIGHT);
                      if (selectedIndex !== minutes) {
                        handleMinutesChange(selectedIndex);
                      }
                    }
                  }}
                >
                  {/* 上部の空白 */}
                  <View style={{ height: ITEM_HEIGHT }} />
                  {Array.from({ length: 60 }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.pickerItem,
                        minutes === i && styles.pickerItemSelected
                      ]}
                      onPress={() => handleMinutesChange(i)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        minutes === i && styles.pickerItemTextSelected
                      ]}>
                        {i.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {/* 下部の空白 */}
                  <View style={{ height: ITEM_HEIGHT }} />
                </ScrollView>
                <View style={styles.pickerSelectionIndicator} />
              </View>
            </View>

            {/* Seconds Picker */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerColumnLabel}>Seconds</Text>
              <View style={styles.pickerWrapper}>
                <ScrollView 
                  ref={secondsScrollRef}
                  style={styles.pickerScrollView}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={(event) => {
                    if (!isUpdatingScroll) {
                      const y = event.nativeEvent.contentOffset.y;
                      const selectedIndex = Math.round(y / ITEM_HEIGHT);
                      if (selectedIndex !== seconds) {
                        handleSecondsChange(selectedIndex);
                      }
                    }
                  }}
                >
                  {/* 上部の空白 */}
                  <View style={{ height: ITEM_HEIGHT }} />
                  {Array.from({ length: 60 }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.pickerItem,
                        seconds === i && styles.pickerItemSelected
                      ]}
                      onPress={() => handleSecondsChange(i)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        seconds === i && styles.pickerItemTextSelected
                      ]}>
                        {i.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {/* 下部の空白 */}
                  <View style={{ height: ITEM_HEIGHT }} />
                </ScrollView>
                <View style={styles.pickerSelectionIndicator} />
              </View>
            </View>
          </View>

          <View style={styles.pickerButtons}>
            <TouchableOpacity
              style={[styles.pickerButton, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pickerButton, 
                styles.setButton,
                (hours === 0 && minutes === 0 && seconds === 0) && styles.disabledButton
              ]}
              onPress={handleTimeSet}
              disabled={hours === 0 && minutes === 0 && seconds === 0}
            >
              <Text style={styles.setButtonText}>Set</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  customTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  customTimeText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#6366f1',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pickerContainer: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    maxWidth: 320,
  },
  pickerLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: isDark ? '#e5e7eb' : '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  timeDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: isDark ? '#ffffff' : '#1f2937',
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerColumnLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 8,
  },
  pickerWrapper: {
    height: SCROLL_VIEW_HEIGHT,
    width: '100%',
    position: 'relative',
  },
  pickerScrollView: {
    height: SCROLL_VIEW_HEIGHT,
    width: '100%',
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  pickerItemSelected: {
    backgroundColor: '#6366f1',
  },
  pickerItemText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: isDark ? '#e5e7eb' : '#374151',
  },
  pickerItemTextSelected: {
    color: '#ffffff',
    fontFamily: 'Roboto-Bold',
  },
  pickerSelectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#6366f1',
    pointerEvents: 'none',
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
    marginRight: 8,
  },
  setButton: {
    backgroundColor: '#6366f1',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: isDark ? '#4b5563' : '#9ca3af',
    opacity: 0.5,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: isDark ? '#e5e7eb' : '#374151',
  },
  setButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#ffffff',
  },
});