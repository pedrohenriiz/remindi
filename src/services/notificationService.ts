import * as Notifications from 'expo-notifications';
import { Dose } from '../database/repositories/doseRepository';

// Configura como as notificações aparecem quando o app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Agenda duas notificações para uma dose:
// - 1h antes do horário agendado
// - No momento exato do horário
export async function scheduleDoseNotifications(dose: Dose): Promise<void> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const [hours, minutes] = dose.scheduledTime.split(':').map(Number);
  const [year, month, day] = dose.scheduledDate.split('-').map(Number);

  const scheduledDate = new Date(year, month - 1, day, hours, minutes, 0);
  const oneHourBefore = new Date(scheduledDate.getTime() - 60 * 60 * 1000);
  const now = new Date();

  // Notificação 1h antes — só agenda se ainda não passou
  if (oneHourBefore > now) {
    await Notifications.scheduleNotificationAsync({
      identifier: `dose-reminder-${dose.id}`,
      content: {
        title: `${dose.medicationName} em 1 hora`,
        body: `${dose.medicationUnit} agendado para às ${dose.scheduledTime}`,
        data: { doseId: dose.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: oneHourBefore,
      },
    });
  }

  // Notificação no horário exato — só agenda se ainda não passou
  if (scheduledDate > now) {
    await Notifications.scheduleNotificationAsync({
      identifier: `dose-now-${dose.id}`,
      content: {
        title: `Hora de tomar ${dose.medicationName}`,
        body: `${dose.medicationUnit}`,
        data: { doseId: dose.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: scheduledDate,
      },
    });
  }
}

// Cancela todas as notificações de uma dose
export async function cancelDoseNotifications(doseId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(
    `dose-reminder-${doseId}`,
  );
  await Notifications.cancelScheduledNotificationAsync(`dose-now-${doseId}`);
}

// Cancela todas as notificações de um medicamento (ao deletar)
export async function cancelMedicationNotifications(
  doseIds: string[],
): Promise<void> {
  await Promise.all(doseIds.map((id) => cancelDoseNotifications(id)));
}

// Agenda notificações para uma lista de doses (usado ao salvar medicamento ou rodar o job)
export async function scheduleNotificationsForDoses(
  doses: Dose[],
): Promise<void> {
  await Promise.all(doses.map((dose) => scheduleDoseNotifications(dose)));
}
