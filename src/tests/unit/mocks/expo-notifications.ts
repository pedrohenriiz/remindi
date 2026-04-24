export const setNotificationHandler = jest.fn();
export const getPermissionsAsync = jest
  .fn()
  .mockResolvedValue({ status: 'granted' });
export const requestPermissionsAsync = jest
  .fn()
  .mockResolvedValue({ status: 'granted' });
export const scheduleNotificationAsync = jest
  .fn()
  .mockResolvedValue('mock-notification-id');
export const cancelScheduledNotificationAsync = jest
  .fn()
  .mockResolvedValue(undefined);
export const setNotificationChannelAsync = jest
  .fn()
  .mockResolvedValue(undefined);

export const AndroidImportance = { HIGH: 4 };
export const SchedulableTriggerInputTypes = { DATE: 'date' };
