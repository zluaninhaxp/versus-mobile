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
}

export function RankItem({
  position,
  nome,
  ml,
  meta,
  foto,
  reactions,
}: RankItemProps) {
  // Top 3 recebem o card colorido e grande
  if (position <= 3) {
    return (
      <RankItemTop3
        position={position}
        name={nome}
        ml={ml}
        goal={meta}
        photo={foto}
        reactions={reactions}
      />
    );
  }

  // 4º em diante recebem o card simples
  return (
    <RankItemRegular
      position={position}
      name={nome}
      ml={ml}
      goal={meta}
      photo={foto}
      reactions={reactions}
    />
  );
}
