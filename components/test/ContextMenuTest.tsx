import { Stack } from 'expo-router';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Text } from '~/components/nativewindui/Text';
import { AlertAnchor } from '~/components/nativewindui/Alert';
import { AlertRef } from '~/components/nativewindui/Alert/types';
import { Button } from '~/components/nativewindui/Button';
import { ContextMenu } from '~/components/nativewindui/ContextMenu/ContextMenu';
import { ContextMenuRef } from '~/components/nativewindui/ContextMenu/types';
import {
  createContextItem,
  createContextSubMenu,
} from '~/components/nativewindui/ContextMenu/utils';
import { useColorScheme } from '~/lib/useColorScheme';

export default function ContextMenuScreen() {
  const [checked, setChecked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const { colors } = useColorScheme();
  const ref = React.useRef<ContextMenuRef>(null);
  const [selectedEmoji, setSelectedEmoji] = React.useState('');
  const alertRef = React.useRef<AlertRef>(null);

  const dynamicItems = React.useMemo(() => {
    return [
      createContextSubMenu({ title: 'Sub Menu', iOSItemSize: 'small', loading: isLoading }, [
        createContextSubMenu({ title: 'Submenu 2' }, [
          { actionKey: '1', title: 'Item 1' },
          { actionKey: '2', title: 'Item 2' },
        ]),
        createContextItem({ actionKey: '43', title: 'Item 3' }),
      ]),
      createContextItem({
        actionKey: '4',
        title: 'Checkbox Item',
        state: { checked },
        keepOpenOnPress: true,
        icon: {
          namingScheme: 'sfSymbol',
          name: 'checkmark.seal',
          color: colors.primary,
        },
      }),
      createContextItem({
        actionKey: '5',
        title: 'Set to loading',
        keepOpenOnPress: true,
        disabled: isLoading,
      }),
    ];
  }, [checked, isLoading]);

  function handleEmojiPress(emoji: string) {
    return () => {
      if (emoji === selectedEmoji) {
        return;
      }
      setSelectedEmoji(emoji);
      ref.current?.dismissMenu?.();
    };
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Context Menu' }} />
      <View className="justify-center flex-1 gap-8 p-8">
        <ContextMenu
          className="rounded-md"
          title="Dropdown Menu"
          items={STATIC_ITEMS}
          materialAlign="start"
          auxiliaryPreviewPosition="center"
          renderAuxiliaryPreview={() => {
            return (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                className="flex-row items-center justify-center px-12 py-4 bg-red-500 rounded-md">
                <Text variant="footnote">Auxiliary Preview</Text>
              </Animated.View>
            );
          }}
          onItemPress={(item) => {
            alertRef.current?.alert({
              title: 'Item Pressed',
              message: `Item ${item.actionKey} pressed`,
              buttons: [{ text: 'OK' }],
              materialWidth: 350,
            });
          }}>
          <Pressable className="items-center justify-center h-32 border border-dashed rounded-md border-foreground bg-card">
            <Text variant="footnote" className="font-bold text-muted-foreground">
              Static
            </Text>
            <Text>Long Press Me</Text>
          </Pressable>
        </ContextMenu>

        <ContextMenu
          ref={ref}
          className="rounded-md"
          items={dynamicItems}
          auxiliaryPreviewPosition="center"
          renderAuxiliaryPreview={() => {
            return (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                className="flex-row p-2 rounded-md shadow bg-card">
                <Button
                  variant={selectedEmoji === '❤️' ? 'tonal' : 'plain'}
                  size="icon"
                  onPress={handleEmojiPress('❤️')}>
                  <Text variant="footnote">❤️</Text>
                </Button>
                <Button
                  variant={selectedEmoji === '😍' ? 'tonal' : 'plain'}
                  size="icon"
                  onPress={handleEmojiPress('😍')}>
                  <Text variant="footnote">😍</Text>
                </Button>
                <Button
                  variant={selectedEmoji === '🥰' ? 'tonal' : 'plain'}
                  size="icon"
                  onPress={handleEmojiPress('🥰')}>
                  <Text variant="footnote">🥰</Text>
                </Button>
                <Button
                  variant={selectedEmoji === '💘' ? 'tonal' : 'plain'}
                  size="icon"
                  onPress={handleEmojiPress('💘')}>
                  <Text variant="footnote">💘</Text>
                </Button>
              </Animated.View>
            );
          }}
          onItemPress={(item) => {
            if (item.actionKey === '4') {
              setChecked((prev) => !prev);
              return;
            }
            if (item.actionKey === '5') {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
              }, 1500);
              return;
            }
            alertRef.current?.alert({
              title: 'Item Pressed',
              message: `Item ${item.actionKey} pressed`,
              buttons: [{ text: 'OK' }],
              materialWidth: 350,
            });
          }}>
          <Pressable
            onLongPress={() => {
              if (isLoading) {
                setTimeout(() => {
                  setIsLoading(false);
                }, 1500);
              }
            }}
            className="items-center justify-center h-32 border border-dashed rounded-md border-primary bg-card">
            <Text variant="footnote" className="font-bold text-muted-foreground">
              With State
            </Text>
            <Text variant="footnote">Checked: {checked ? 'true' : 'false'}</Text>
            <Text variant="footnote">Emoji: {selectedEmoji}</Text>
          </Pressable>
        </ContextMenu>
      </View>
      <AlertAnchor ref={alertRef} />
    </>
  );
}

const STATIC_ITEMS = [
  createContextSubMenu({ title: 'Submenu 1', iOSItemSize: 'small', loading: false }, [
    createContextSubMenu({ title: 'Sub', iOSItemSize: 'small' }, [
      { actionKey: '10', title: 'Select Me' },
      { actionKey: '20', title: 'No! Select Me!' },
    ]),
    createContextItem({
      actionKey: '430',
      title: 'Item 430',
      icon: { name: 'checkmark.seal', namingScheme: 'sfSymbol' },
    }),
  ]),
  createContextSubMenu({ title: 'Hello', iOSItemSize: 'small' }, [
    createContextItem({
      actionKey: '30',
      icon: { name: 'checkmark.seal', namingScheme: 'sfSymbol' },
    }),
    createContextItem({
      actionKey: '31',
      icon: { name: 'checkmark.seal', namingScheme: 'sfSymbol' },
    }),
    createContextItem({
      actionKey: '32',
      icon: { name: 'checkmark.seal', namingScheme: 'sfSymbol' },
    }),
    createContextItem({
      actionKey: '33',
      icon: { name: 'checkmark.seal', namingScheme: 'sfSymbol' },
    }),
  ]),
  createContextSubMenu({ title: '', iOSType: 'inline', iOSItemSize: 'small' }, [
    createContextItem({
      actionKey: '130',
      title: '💧',
    }),
    createContextItem({
      actionKey: '131',
      title: '💧',
    }),
    createContextItem({
      actionKey: '132',
      title: '💧',
    }),
    createContextItem({
      actionKey: '133',
      title: '💧',
    }),
  ]),
  createContextItem({
    actionKey: '40',
    title: 'Delete Computer',
    destructive: true,
    image: { url: 'https://picsum.photos/id/2/100', cornerRadius: 30 },
  }),
];