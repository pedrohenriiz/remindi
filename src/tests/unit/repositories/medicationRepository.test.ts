import { medicationRepository } from '../../../database/repositories/medicationRepository';
import { MedicationFormData } from '../../../pages/AddMedication/validationSchema';
import { mockDb } from '../mocks/database';

jest.mock('../../../database', () => require('../mocks/database'));
jest.mock('expo-crypto', () => ({
  randomUUID: jest
    .fn()
    .mockReturnValueOnce('uuid-med-1')
    .mockReturnValueOnce('uuid-day-1')
    .mockReturnValueOnce('uuid-day-2')
    .mockReturnValueOnce('uuid-sch-1'),
}));

const baseMedicationData: MedicationFormData = {
  name: 'Dipirona',
  amount: '500',
  type: 'tablet',
  unit: 'comprimido(s)',
  scheduleMode: 'manual',
  schedules: ['08:00'],
  weekDays: [1, 2, 3],
  recurring: false,
};

const baseMedicationRow = {
  id: 'uuid-med-1',
  name: 'Dipirona',
  amount: '500',
  type: 'tablet',
  unit: 'comprimido(s)',
  schedule_mode: 'manual',
  interval: null,
  first_dose: null,
  recurring: 0,
  created_at: '2024-01-01T00:00:00.000Z',
};

describe('medicationRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.getAllAsync.mockResolvedValue([]);
    mockDb.getFirstAsync.mockResolvedValue(null);
    mockDb.runAsync.mockResolvedValue({ changes: 1, lastInsertRowId: 1 });
  });

  // ─── save ────────────────────────────────────────────────────────────────

  describe('save', () => {
    it('deve salvar um medicamento e retornar o objeto completo', async () => {
      mockDb.getAllAsync
        .mockResolvedValueOnce([
          { week_day: 1 },
          { week_day: 2 },
          { week_day: 3 },
        ])
        .mockResolvedValueOnce([{ time: '08:00' }]);

      const result = await medicationRepository.save(baseMedicationData);

      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.data.name).toBe('Dipirona');
      expect(result.data.amount).toBe('500');
      expect(result.data.type).toBe('tablet');
      expect(result.data.recurring).toBe(false);
      expect(result.data.weekDays).toEqual([1, 2, 3]);
      expect(result.data.schedules).toEqual(['08:00']);
    });

    it('deve chamar withTransactionAsync ao salvar', async () => {
      mockDb.getAllAsync.mockResolvedValue([]);

      await medicationRepository.save(baseMedicationData);

      expect(mockDb.withTransactionAsync).toHaveBeenCalledTimes(1);
    });

    it('deve inserir os weekDays corretamente', async () => {
      mockDb.getAllAsync.mockResolvedValue([]);

      await medicationRepository.save(baseMedicationData);

      const calls = mockDb.runAsync.mock.calls;
      const weekDayCalls = calls.filter(
        (call: unknown[]) =>
          typeof call[0] === 'string' &&
          call[0].includes('medication_week_days'),
      );

      expect(weekDayCalls).toHaveLength(3);
    });

    it('deve inserir os schedules corretamente', async () => {
      mockDb.getAllAsync.mockResolvedValue([]);

      await medicationRepository.save(baseMedicationData);

      const calls = mockDb.runAsync.mock.calls;
      const scheduleCalls = calls.filter(
        (call: unknown[]) =>
          typeof call[0] === 'string' &&
          call[0].includes('medication_schedules'),
      );

      expect(scheduleCalls).toHaveLength(1);
    });

    it('deve salvar recurring como 1 quando true', async () => {
      mockDb.getAllAsync.mockResolvedValue([]);

      await medicationRepository.save({
        ...baseMedicationData,
        recurring: true,
      });

      const calls = mockDb.runAsync.mock.calls;
      const insertCall = calls.find(
        (call: unknown[]) =>
          typeof call[0] === 'string' &&
          call[0].includes('INSERT INTO medications'),
      );

      expect(insertCall).toBeDefined();
      expect(insertCall[1]).toContain(1); // recurring = 1
    });

    it('deve retornar erro quando o banco falha', async () => {
      mockDb.withTransactionAsync.mockRejectedValueOnce(new Error('DB error'));

      const result = await medicationRepository.save(baseMedicationData);

      expect(result.success).toBe(false);
    });
  });

  // ─── findAll ─────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('deve retornar lista vazia quando não há medicamentos', async () => {
      mockDb.getAllAsync.mockResolvedValue([]);

      const result = await medicationRepository.findAll();

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual([]);
    });

    it('deve retornar medicamentos com weekDays e schedules hidratados', async () => {
      mockDb.getAllAsync
        .mockResolvedValueOnce([baseMedicationRow])
        .mockResolvedValueOnce([{ week_day: 1 }, { week_day: 3 }])
        .mockResolvedValueOnce([{ time: '08:00' }, { time: '20:00' }]);

      const result = await medicationRepository.findAll();

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toHaveLength(1);
      expect(result.data[0].weekDays).toEqual([1, 3]);
      expect(result.data[0].schedules).toEqual(['08:00', '20:00']);
    });

    it('deve converter recurring de 0 para false', async () => {
      mockDb.getAllAsync
        .mockResolvedValueOnce([{ ...baseMedicationRow, recurring: 0 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await medicationRepository.findAll();

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data[0].recurring).toBe(false);
    });

    it('deve converter recurring de 1 para true', async () => {
      mockDb.getAllAsync
        .mockResolvedValueOnce([{ ...baseMedicationRow, recurring: 1 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await medicationRepository.findAll();

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data[0].recurring).toBe(true);
    });

    it('deve retornar erro quando o banco falha', async () => {
      mockDb.getAllAsync.mockRejectedValueOnce(new Error('DB error'));

      const result = await medicationRepository.findAll();

      expect(result.success).toBe(false);
    });
  });

  // ─── findById ────────────────────────────────────────────────────────────

  describe('findById', () => {
    it('deve retornar null quando medicamento não existe', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce(null);

      const result = await medicationRepository.findById('id-inexistente');

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeNull();
    });

    it('deve retornar o medicamento quando existe', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce(baseMedicationRow);
      mockDb.getAllAsync
        .mockResolvedValueOnce([{ week_day: 1 }])
        .mockResolvedValueOnce([{ time: '08:00' }]);

      const result = await medicationRepository.findById('uuid-med-1');

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data?.name).toBe('Dipirona');
      expect(result.data?.id).toBe('uuid-med-1');
    });

    it('deve retornar erro quando o banco falha', async () => {
      mockDb.getFirstAsync.mockRejectedValueOnce(new Error('DB error'));

      const result = await medicationRepository.findById('uuid-med-1');

      expect(result.success).toBe(false);
    });
  });

  // ─── update ──────────────────────────────────────────────────────────────

  describe('update', () => {
    it('deve atualizar o medicamento e retornar os dados atualizados', async () => {
      const updatedRow = { ...baseMedicationRow, name: 'Paracetamol' };
      mockDb.getFirstAsync.mockResolvedValueOnce(updatedRow);
      mockDb.getAllAsync
        .mockResolvedValueOnce([{ week_day: 1 }])
        .mockResolvedValueOnce([{ time: '10:00' }]);

      const result = await medicationRepository.update('uuid-med-1', {
        ...baseMedicationData,
        name: 'Paracetamol',
      });

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.name).toBe('Paracetamol');
    });

    it('deve deletar weekDays e schedules antigos antes de reinserir', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce(baseMedicationRow);
      mockDb.getAllAsync.mockResolvedValue([]);

      await medicationRepository.update('uuid-med-1', baseMedicationData);

      const calls = mockDb.runAsync.mock.calls;
      const deleteCalls = calls.filter(
        (call: unknown[]) =>
          typeof call[0] === 'string' && call[0].includes('DELETE FROM'),
      );

      expect(deleteCalls).toHaveLength(2);
    });

    it('deve retornar erro quando o banco falha', async () => {
      mockDb.withTransactionAsync.mockRejectedValueOnce(new Error('DB error'));

      const result = await medicationRepository.update(
        'uuid-med-1',
        baseMedicationData,
      );

      expect(result.success).toBe(false);
    });
  });

  // ─── delete ──────────────────────────────────────────────────────────────

  describe('delete', () => {
    it('deve deletar o medicamento pelo id', async () => {
      const result = await medicationRepository.delete('uuid-med-1');

      expect(result.success).toBe(true);
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'DELETE FROM medications WHERE id = ?',
        ['uuid-med-1'],
      );
    });

    it('deve retornar erro quando o banco falha', async () => {
      mockDb.runAsync.mockRejectedValueOnce(new Error('DB error'));

      const result = await medicationRepository.delete('uuid-med-1');

      expect(result.success).toBe(false);
    });
  });
});
