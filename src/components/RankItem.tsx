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
  const [localReactions, setLocalReactions] = useState(props.reactions || []);

  // Lógica dinâmica: Se a meta aumentar no modal, isso vira false na hora
  const metaAlcancada = props.ml >= props.meta;
  const isMe = props.nome === "Luana Castro";
  const myId =
    props.position <= 3 ? `top3-${props.position}` : `reg-${props.position}`;

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

  // Se ml for 0 ou posição > 3, usa visual regular
  if (props.position <= 3 && props.ml > 0) {
    return <RankItemTop3 {...dataProps} />;
  }

  return <RankItemRegular {...dataProps} />;
}
