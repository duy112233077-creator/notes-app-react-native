import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="document-text-outline" activeIcon="document-text">
              Ghi chú
            </TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton icon="pie-chart-outline" activeIcon="pie-chart">
              Thống kê
            </TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

interface TabButtonProps extends TabTriggerSlotProps {
  icon?: any;
  activeIcon?: any;
}

export function TabButton({
  children,
  isFocused,
  icon,
  activeIcon,
  ...props
}: TabButtonProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={[
          styles.tabButtonView,
          isFocused && styles.tabButtonActive,
        ]}>
        {icon && (
          <Ionicons
            name={isFocused ? activeIcon || icon : icon}
            size={16}
            color={isFocused ? '#2563EB' : '#64748B'}
            style={{ marginRight: 6 }}
          />
        )}
        <ThemedText
          type="smallBold"
          style={{
            color: isFocused ? '#2563EB' : '#64748B',
          }}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Ionicons name="document-text" size={15} color="#FFFFFF" />
          </View>
          <ThemedText type="smallBold" style={styles.brandText}>
            NoteApp
          </ThemedText>
        </View>

        <View style={styles.tabButtonsRow}>{props.children}</View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    pointerEvents: 'box-none',
  } as any,
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    maxWidth: Math.min(MaxContentWidth, 600),
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.2)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  } as any,
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandBadge: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 15,
    fontWeight: '800',
  },
  tabButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: Spacing.three,
    borderRadius: 14,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
});
