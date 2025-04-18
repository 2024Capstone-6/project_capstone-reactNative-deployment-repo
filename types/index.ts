export interface Word {
  word_id: number;
  word: string;
  word_meaning: string;
  word_furigana: string;
  word_level: string;
  word_quiz: string[];
  word_example?: string[];
  word_e_meaning?: string[];
  word_e_card?: string[];
  word_s_card?: string[];
}

export interface Grammar {
  grammar_id: number;
  grammar: string;
  grammar_meaning: string;
  grammar_furigana: string;
  grammar_level: string;
  grammar_quiz: string[];
  grammar_example?: string[];
  grammar_e_meaning?: string[];
  grammar_e_card?: string[];
  grammar_s_card?: string[];
}

export interface Bookmark {
  id: number;
  type: 'word' | 'grammar';
  content: Word | Grammar;
  created_at: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
