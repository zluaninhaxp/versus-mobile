import React, { useState } from "react";
import { RankItemTop3 } from "./RankItemTop3";
import { RankItemRegular } from "./RankItemRegular";

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
}

export function RankItem(props: RankItemProps) {
  // Estado local para as reações (gerenciado aqui para os dois tipos de visual)
  const [localReactions, setLocalReactions] = useState(props.reactions || []);

  // Regras de Negócio centralizadas
  const metaAlcancada = props.ml >= props.meta;
  const isMe = props.nome === "Luana Castro"; // Trava para seu perfil
  const myId =
    props.position <= 3 ? `top3-${props.position}` : `reg-${props.position}`;

  // Props preparadas para os subcomponentes
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
    onReactionUpdate: (newReactions: { emoji: string; count: number }[]) =>
      setLocalReactions(newReactions),
  };

  /**
   * LÓGICA DE RENDERIZAÇÃO:
   * 1. Se a posição for Top 3 (1, 2 ou 3) E o usuário já bebeu algo (> 0 ml), usa o visual de pódio.
   * 2. Caso contrário (posição > 3 OU ml === 0), usa o visual de lista regular.
   */
  if (props.position <= 3 && props.ml > 0) {
    return <RankItemTop3 {...dataProps} />;
  }

  return <RankItemRegular {...dataProps} />;
}
