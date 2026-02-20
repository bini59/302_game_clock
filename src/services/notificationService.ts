import notifee, {
  TriggerType,
  RepeatFrequency,
  AndroidImportance,
  AndroidCategory,
} from '@notifee/react-native'
import { Platform } from 'react-native'

const ALARM_CHANNEL_ID = 'alarm-channel'
const REMINDER_CHANNEL_ID = 'reminder-channel'

export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return

  await notifee.createChannel({
    id: ALARM_CHANNEL_ID,
    name: '알람',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  })

  await notifee.createChannel({
    id: REMINDER_CHANNEL_ID,
    name: '리마인더',
    importance: AndroidImportance.DEFAULT,
  })
}

export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await notifee.requestPermission()
  return settings.authorizationStatus >= 1
}

export async function scheduleAlarm(
  hour: number,
  minute: number,
  label: string,
): Promise<string> {
  const now = new Date()
  const alarm = new Date()
  alarm.setHours(hour, minute, 0, 0)

  if (alarm.getTime() <= now.getTime()) {
    alarm.setDate(alarm.getDate() + 1)
  }

  const trigger = {
    type: TriggerType.TIMESTAMP as const,
    timestamp: alarm.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
  }

  const notificationId = await notifee.createTriggerNotification(
    {
      title: '⏰ 알람',
      body: label || '알람이 울립니다!',
      android: {
        channelId: ALARM_CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        category: AndroidCategory.ALARM,
        sound: 'default',
        pressAction: { id: 'default' },
      },
      ios: {
        sound: 'default',
        interruptionLevel: 'timeSensitive',
      },
    },
    trigger,
  )

  return notificationId
}

export async function cancelAlarm(notificationId: string): Promise<void> {
  await notifee.cancelNotification(notificationId)
}

export async function cancelAllAlarms(): Promise<void> {
  await notifee.cancelAllNotifications()
}

export async function sendDailyCheckInReminder(): Promise<string> {
  const now = new Date()
  const reminder = new Date()
  reminder.setHours(20, 0, 0, 0)

  if (reminder.getTime() <= now.getTime()) {
    reminder.setDate(reminder.getDate() + 1)
  }

  const trigger = {
    type: TriggerType.TIMESTAMP as const,
    timestamp: reminder.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
  }

  return notifee.createTriggerNotification(
    {
      title: '📋 출석 체크',
      body: '오늘의 출석 체크를 잊지 마세요! 연속 출석 보너스가 기다리고 있어요.',
      android: {
        channelId: REMINDER_CHANNEL_ID,
        pressAction: { id: 'default' },
      },
    },
    trigger,
  )
}
