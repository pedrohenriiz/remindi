import { doseRepository } from '../../../database/repositories/doseRepository';
import { Medication } from '../../../database/repositories/medicationRepository';
import { mockDb } from '../mocks/database';

jest.mock('../../../database', () => require('../mocks/database'));
jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('uuid-dose-1'),
}));

const baseMedication: Medication = {
  id: 'med-1',
  name: 'Dipirona',
  amount: '500',
  unit: 'comprimido(s)',
  type: 'tablet',
  scheduleMode: 'manual',
  schedules: ['08:00', '20:00'],
  weekDays: [0, 1, 2, 3, 4, 5, 6], // todos os dias
  recurring: false,
  createdAt: '2024-01-01T00:00:00.000Z',
};

const baseDoseRow = {
  id: 'dose-1',
  medication_id: 'med-1',
  medication_name: 'Dipirona',
  medication_unit: '500 • comprimido(s)',
  medication_type: 'tablet',
  scheduled_date: '2024-06-10',
  scheduled_time: '08:00',
  status: 'pending',
  confirmed_at: null,
};

describe('doseRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.getAllAsync.mockResolvedValue([]);
    mockDb.getFirstAsync.mockResolvedValue(null);
    mockDb.runAsync.mockResolvedValue({ changes: 1 });
  });

  // ─── generateForMedication ───────────────────────────────────────────────

  describe('generateForMedication', () => {
    it('deve retornar ok sem inserir quando a data não está nos weekDays', async () => {
      // 2024-06-10 é uma segunda (1), medicamento só para sábado (6)
      const medication = { ...baseMedication, weekDays: [6] };

      const result = await doseRepository.generateForMedication(
        medication,
        '2024-06-10',
      );

      expect(result.success).toBe(true);
      expect(mockDb.runAsync).not.toHaveBeenCalled();
    });

    it('deve retornar ok sem inserir quando já existem doses para a data', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([{ id: 'dose-existente' }]);

      const result = await doseRepository.generateForMedication(
        baseMedication,
        '2024-06-10',
      );

      expect(result.success).toBe(true);
      expect(mockDb.withTransactionAsync).not.toHaveBeenCalled();
    });

    it('deve inserir doses quando a data está nos weekDays e não há duplicatas', async () => {
      // Sem doses existentes
      mockDb.getAllAsync.mockResolvedValueOnce([]);

      const result = await doseRepository.generateForMedication(
        baseMedication,
        '2024-06-10',
      );

      expect(result.success).toBe(true);
      expect(mockDb.withTransactionAsync).toHaveBeenCalledTimes(1);
    });

    it('deve retornar erro quando o banco falha', async () => {
      mockDb.getAllAsync.mockRejectedValueOnce(new Error('DB error'));

      const result = await doseRepository.generateForMedication(
        baseMedication,
        '2024-06-10',
      );

      expect(result.success).toBe(false);
    });
  });

  // ─── findByDate ──────────────────────────────────────────────────────────

  describe('findByDate', () => {
    it('deve retornar lista vazia quando não há doses', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([]);

      const result = await doseRepository.findByDate('2024-06-10');

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual([]);
    });

    it('deve retornar doses mapeadas corretamente', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([baseDoseRow]);

      const result = await doseRepository.findByDate('2024-06-10');

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('dose-1');
      expect(result.data[0].medicationName).toBe('Dipirona');
      expect(result.data[0].scheduledTime).toBe('08:00');
      expect(result.data[0].status).toBe('pending');
    });

    it('deve mapear confirmed_at corretamente', async () => {
      const doseWithConfirm = {
        ...baseDoseRow,
        status: 'administered',
        confirmed_at: '2024-06-10T08:05:00.000Z',
      };
      mockDb.getAllAsync.mockResolvedValueOnce([doseWithConfirm]);

      const result = await doseRepository.findByDate('2024-06-10');

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data[0].confirmedAt).toBe('2024-06-10T08:05:00.000Z');
    });

    it('deve retornar erro quando o banco falha', async () => {
      mockDb.getAllAsync.mockRejectedValueOnce(new Error('DB error'));

      const result = await doseRepository.findByDate('2024-06-10');

      expect(result.success).toBe(false);
    });
  });

  // ─── findNextPending ─────────────────────────────────────────────────────

  describe('findNextPending', () => {
    it('deve retornar null quando não há doses pendentes', async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);

      const result = await doseRepository.findNextPending();

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeNull();
    });

    it('deve retornar a próxima dose futura pendente', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce(baseDoseRow);

      const result = await doseRepository.findNextPending();

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data?.id).toBe('dose-1');
      expect(result.data?.status).toBe('pending');
    });

    it('deve buscar dose passada quando não há futuras pendentes', async () => {
      // Primeira query (futura) retorna null, segunda (passada) retorna dose
      mockDb.getFirstAsync
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(baseDoseRow);

      const result = await doseRepository.findNextPending();

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data?.id).toBe('dose-1');
      expect(mockDb.getFirstAsync).toHaveBeenCalledTimes(2);
    });

    it('deve retornar erro quando o banco falha', async () => {
      mockDb.getFirstAsync.mockRejectedValueOnce(new Error('DB error'));

      const result = await doseRepository.findNextPending();

      expect(result.success).toBe(false);
    });
  });

  // ─── updateStatus ────────────────────────────────────────────────────────

  describe('updateStatus', () => {
    it('deve atualizar status para administered e setar confirmed_at', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce({
        ...baseDoseRow,
        status: 'administered',
        confirmed_at: '2024-06-10T08:05:00.000Z',
      });

      const result = await doseRepository.updateStatus(
        'dose-1',
        'administered',
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.status).toBe('administered');
      expect(result.data.confirmedAt).toBeDefined();

      const updateCall = mockDb.runAsync.mock.calls[0];
      expect(updateCall[0]).toContain('UPDATE doses SET status');
      expect(updateCall[1][0]).toBe('administered');
    });

    it('deve atualizar status para skipped com confirmed_at null', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce({
        ...baseDoseRow,
        status: 'skipped',
        confirmed_at: null,
      });

      const result = await doseRepository.updateStatus('dose-1', 'skipped');

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.status).toBe('skipped');

      const updateCall = mockDb.runAsync.mock.calls[0];
      expect(updateCall[1][1]).toBeNull(); // confirmed_at deve ser null
    });

    it('deve retornar erro quando dose não é encontrada após update', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce(null);

      const result = await doseRepository.updateStatus(
        'dose-inexistente',
        'skipped',
      );

      expect(result.success).toBe(false);
    });

    it('deve retornar erro quando o banco falha', async () => {
      mockDb.runAsync.mockRejectedValueOnce(new Error('DB error'));

      const result = await doseRepository.updateStatus(
        'dose-1',
        'administered',
      );

      expect(result.success).toBe(false);
    });
  });

  // ─── markMissedDoses ─────────────────────────────────────────────────────

  describe('markMissedDoses', () => {
    it('deve retornar o número de doses marcadas como perdidas', async () => {
      mockDb.runAsync.mockResolvedValueOnce({ changes: 3 });

      const result = await doseRepository.markMissedDoses();

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBe(3);
    });

    it('deve retornar 0 quando não há doses a marcar', async () => {
      mockDb.runAsync.mockResolvedValueOnce({ changes: 0 });

      const result = await doseRepository.markMissedDoses();

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBe(0);
    });

    it('deve chamar UPDATE com status missed, data e horário corretos', async () => {
      mockDb.runAsync.mockResolvedValueOnce({ changes: 1 });

      await doseRepository.markMissedDoses();

      const call = mockDb.runAsync.mock.calls[0];
      expect(call[0]).toContain("SET status = 'missed'");
      expect(call[0]).toContain('scheduled_date = ?');
      expect(call[0]).toContain('scheduled_time < ?');
    });

    it('deve retornar erro quando o banco falha', async () => {
      mockDb.runAsync.mockRejectedValueOnce(new Error('DB error'));

      const result = await doseRepository.markMissedDoses();

      expect(result.success).toBe(false);
    });
  });

  // ─── getMarkedDates ──────────────────────────────────────────────────────

  describe('getMarkedDates', () => {
    it('deve retornar objeto vazio quando não há doses finalizadas', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([]);

      const result = await doseRepository.getMarkedDates();

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({});
    });

    it('deve marcar como complete quando todas as doses foram administradas', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([
        { scheduled_date: '2024-06-10', total: 3, administered: 3, missed: 0 },
      ]);

      const result = await doseRepository.getMarkedDates();

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data['2024-06-10'].status).toBe('complete');
    });

    it('deve marcar como missed quando todas as doses foram perdidas', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([
        { scheduled_date: '2024-06-10', total: 2, administered: 0, missed: 2 },
      ]);

      const result = await doseRepository.getMarkedDates();

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data['2024-06-10'].status).toBe('missed');
    });

    it('deve marcar como partial quando há mix de status', async () => {
      mockDb.getAllAsync.mockResolvedValueOnce([
        { scheduled_date: '2024-06-10', total: 3, administered: 1, missed: 1 },
      ]);

      const result = await doseRepository.getMarkedDates();

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data['2024-06-10'].status).toBe('partial');
    });

    it('deve retornar erro quando o banco falha', async () => {
      mockDb.getAllAsync.mockRejectedValueOnce(new Error('DB error'));

      const result = await doseRepository.getMarkedDates();

      expect(result.success).toBe(false);
    });
  });
});
