import React from "react";
import { CellModel } from "../../../model/cell/CellModel";
import style from "./Cell.module.scss";

interface Props {
  cell: CellModel;
  play: (cellId: number) => void;
}
<<<<<<< Updated upstream
const Cell: React.FC<Props> = ({ cell, play }) => {
  console.log(cell);

 
=======
const { play } = useTicTacToeVM();
const Cell: React.FC<Props> = ({ cell }) => {

>>>>>>> Stashed changes
  return (
    <button onClick={()=>play(cell._id)} className={style.cell}>
      <div>{cell.XorY}</div>
    </button>
  );
};

export default Cell;
