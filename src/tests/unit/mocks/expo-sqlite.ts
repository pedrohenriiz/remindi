const mockDb = {
  execAsync: jest.fn().mockResolvedValue(undefined),
  runAsync: jest.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 1 }),
  getAllAsync: jest.fn().mockResolvedValue([]),
  getFirstAsync: jest.fn().mockResolvedValue(null),
  withTransactionAsync: jest.fn().mockImplementation(async (cb) => {
    await cb();
  }),
};

export const openDatabaseAsync = jest.fn().mockResolvedValue(mockDb);

export { mockDb };
