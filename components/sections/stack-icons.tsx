// Icones de marca para o stack citado no Hero (ver StackIconsRow em hero.tsx).
// Vem do simple-icons (named imports, tree-shakeable): soh carrega o path das
// tecnologias usadas aqui, nao o pacote inteiro.

import {
  siAngular,
  siDocker,
  siFastapi,
  siFirebase,
  siFlutter,
  siHostinger,
  siLangchain,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siSupabase,
  siTypescript,
} from "simple-icons";

// Ordem de exibicao na fileira do Hero.
export const STACK_ICONS: { name: string; path: string }[] = [
  { name: "LangChain", path: siLangchain.path },
  { name: "Python", path: siPython.path },
  { name: "PostgreSQL", path: siPostgresql.path },
  { name: "Next.js", path: siNextdotjs.path },
  { name: "TypeScript", path: siTypescript.path },
  { name: "Supabase", path: siSupabase.path },
  { name: "React", path: siReact.path },
  { name: "FastAPI", path: siFastapi.path },
  { name: "Node.js", path: siNodedotjs.path },
  { name: "Flutter", path: siFlutter.path },
  { name: "Docker", path: siDocker.path },
  { name: "Firebase", path: siFirebase.path },
  { name: "Angular", path: siAngular.path },
  { name: "Hostinger", path: siHostinger.path },
];

