// Icones de marca para o stack citado no Hero (ver StackIconsRow em hero.tsx).
// Vem do simple-icons (named imports, tree-shakeable): soh carrega o path das
// tecnologias usadas aqui, nao o pacote inteiro.

import {
  siAngular,
  siFirebase,
  siFlutter,
  siHostinger,
  siLangchain,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siSupabase,
} from "simple-icons";

// Ordem de exibicao na fileira do Hero. LangFuse, Bitrix24 e React Native (mesmo
// logo do React) ficam de fora por nao terem um logo proprio no simple-icons.
export const STACK_ICONS: { name: string; path: string }[] = [
  { name: "N8N", path: siN8n.path },
  { name: "LangChain", path: siLangchain.path },
  { name: "PostgreSQL", path: siPostgresql.path },
  { name: "Supabase", path: siSupabase.path },
  { name: "Next.js", path: siNextdotjs.path },
  { name: "React", path: siReact.path },
  { name: "Python", path: siPython.path },
  { name: "Node.js", path: siNodedotjs.path },
  { name: "Angular", path: siAngular.path },
  { name: "Flutter", path: siFlutter.path },
  { name: "Firebase", path: siFirebase.path },
  { name: "Hostinger", path: siHostinger.path },
];
