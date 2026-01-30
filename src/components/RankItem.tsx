import React from "react";
import { RankItemTop } from "./RankItemTop"; // Verifique se o caminho está correto
import { RankItemRegular } from "./RankItemRegular";

export function RankItem({ position, nome, ml, foto }) {
  // Use 'nome' para bater com o App.js
  if (position === 1) {
    return <RankItemTop name={nome} ml={ml} />;
  }

  return <RankItemRegular position={position} name={nome} ml={ml} />;
}
