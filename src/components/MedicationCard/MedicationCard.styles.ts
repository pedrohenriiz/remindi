import { Theme } from '../../theme/themes';
import { DoseStatus } from '../../types/doseStatusType';
import { MedicationType } from '../../types/medicationType';
import { IconName } from '../Common/Icon';

export const medicationTypeIcon: Record<MedicationType, IconName> = {
  tablet: 'Pill',
  capsule: 'PillBottle',
  liquid: 'Droplet',
  other: 'AlertCircle',
};

export const statusBackground = (status: DoseStatus, theme: Theme) =>
  ({
    pending: theme.colors.primary[50],
    administered: theme.colors.success[50],
    skipped: theme.colors.error[50],
    missed: theme.colors.error[50],
  })[status];

export const statusIconBg = (status: DoseStatus, theme: Theme) =>
  ({
    pending: theme.colors.primary[100],
    administered: theme.colors.success[100],
    skipped: theme.colors.error[100],
    missed: theme.colors.error[100],
  })[status];

export const statusIconColor = (status: DoseStatus, theme: Theme) =>
  ({
    pending: theme.colors.primary[500],
    administered: theme.colors.success[500],
    skipped: theme.colors.error[500],
    missed: theme.colors.error[500],
  })[status];

export const statusTextColor = (status: DoseStatus, theme: Theme) =>
  ({
    pending: theme.colors.primary[800],
    administered: theme.colors.success[600],
    skipped: theme.colors.error[600],
    missed: theme.colors.error[600],
  })[status];
