import React, { useState } from "react";
import { RankItemTop3 } from "./RankItemTop3";
import { RankItemRegular } from "./RankItemRegular";

// Tema de cores passado opcionalmente — se omitido, usa o azul padrão
export interface RankTheme {
  /** Cor primária (gradiente escuro, texto de ml, medalha do top3) */
  primary: string;
  /** Cor secundária (gradiente claro do top3) */
  secondary: string;
  /** Cor do gradiente do card top3 — começa aqui */
  cardFrom: string;
  /** Cor do gradiente do card top3 — termina aqui */
  cardTo: string;
}

export const DEFAULT_RANK_THEME: RankTheme = {
  primary: "#6096ba",
  secondary: "#a3cef1",
  cardFrom: "#6096ba",
  cardTo: "#3f6ea5",
};

interface RankItemProps {
  position: number;
  nome: string;
  ml: number;
  meta: number;
  foto?: string;
  reactions?: { emoji: string; count: number }[];
  activeReactionId: string | null;
  onOpenReaction: (id: string | null) => void;
  onPress?: () => void;
  theme?: RankTheme;
}

export function RankItem(props: RankItemProps) {
  const [localReactions, setLocalReactions] = useState(props.reactions || []);

  const metaAlcancada = props.ml >= props.meta;
  const isMe = props.nome === "Luana Castro";
  const myId =
    props.position <= 3 ? `top3-${props.position}` : `reg-${props.position}`;

  const theme = props.theme ?? DEFAULT_RANK_THEME;

  const dataProps = {
    position: props.position,
    name: props.nome,
    ml: props.ml,
    goal: props.meta,
    photo: props.foto,
    localReactions,
    activeReactionId: props.activeReactionId,
    onOpenReaction: props.onOpenReaction,
    onPress: props.onPress,
    myId,
    isMe,
    metaAlcancada,
    theme,
    onReactionUpdate: (newReactions: { emoji: string; count: number }[]) =>
      setLocalReactions(newReactions),
  };

  if (props.position <= 3 && props.ml > 0) {
    return <RankItemTop3 {...dataProps} />;
  }

  return <RankItemRegular {...dataProps} />;
}
