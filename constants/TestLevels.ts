export type TestLevel = {
  level: string;
};

export const TEST_LEVELS = {
  JLPT: ['JLPT N1', 'JLPT N2', 'JLPT N3', 'JLPT N4', 'JLPT N5'],
  JPT: ['JPT 850', 'JPT 650', 'JPT 450'],
  BJT: ['BJT 800', 'BJT 600', 'BJT 530', 'BJT 450'],
} as const;
