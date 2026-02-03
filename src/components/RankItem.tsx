import React from "react";
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

export function RankItem({
  position,
  nome,
  ml,
  meta,
  foto,
  reactions,
  activeReactionId,
  onOpenReaction,
  onPress,
}: RankItemProps) {
  if (position <= 3) {
    return (
      <RankItemTop3
        position={position}
        name={nome}
        ml={ml}
        goal={meta}
        photo={foto}
        reactions={reactions}
        activeReactionId={activeReactionId}
        onOpenReaction={onOpenReaction}
        onPress={onPress}
      />
    );
  }
  return (
    <RankItemRegular
      position={position}
      name={nome}
      ml={ml}
      goal={meta}
      photo={foto}
      reactions={reactions}
      activeReactionId={activeReactionId}
      onOpenReaction={onOpenReaction}
      onPress={onPress}
    />
  );
}
