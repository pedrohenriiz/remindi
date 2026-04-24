export const mockDb = {
  execAsync: jest.fn().mockResolvedValue(undefined),
  runAsync: jest.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 1 }),
  getAllAsync: jest.fn().mockResolvedValue([]),
  getFirstAsync: jest.fn().mockResolvedValue(null),
  withTransactionAsync: jest
    .fn()
    .mockImplementation(async (cb: () => Promise<void>) => {
      await cb();
    }),
};

export const getDatabase = jest.fn().mockResolvedValue(mockDb);
