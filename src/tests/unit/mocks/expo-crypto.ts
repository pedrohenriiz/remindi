let counter = 0;

export const randomUUID = jest.fn(() => {
  counter++;
  return `mock-uuid-${counter}`;
});

// Reseta o contador entre testes
beforeEach(() => {
  counter = 0;
  randomUUID.mockClear();
});
