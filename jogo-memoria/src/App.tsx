import { useEffect, useState } from 'react';
import * as C from './App.styles';
import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';
import { InfoItem } from './components/InfoItem';
import { Button } from './components/Button';
import { GridItemType } from './types/GridItemType';
import { GridItem } from './components/GridItem';
import { items } from './data/items';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';
import { isFocusable } from '@testing-library/user-event/dist/utils';

const App = () => {

  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMovecount] = useState<number>(0);
  const [showCount, setShowCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      if(playing) setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  useEffect(() => {
    if(showCount === 2) {
      let opened = gridItems.filter(item => item.show === true);

      if(opened.length === 2) {


        if(opened[0].item === opened[1].item) {
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid) {
            if(tmpGrid[i].show) {
              tmpGrid[i].permanentShow = true;
              tmpGrid[i].show = false;
            }
          }
          setGridItems(tmpGrid);
          setShowCount(0);
        } else {
          let tmpGrid = [...gridItems];         
          setTimeout(() =>{
            for(let i in tmpGrid) {
              tmpGrid[i].show = false;
            }   
            setGridItems(tmpGrid);
            setShowCount(0);      
          }, 1000);          
          
        }    
        
      
        setMovecount(moveCount => moveCount + 1);
      }
      
    }
  }, [showCount, gridItems]);

  const handleItemClick = (index: number) => {
    if(playing && index !== null && showCount < 2) {
      let tmpGrid = [...gridItems];

      if(tmpGrid[index].permanentShow === false && tmpGrid[index].show === false) {
        tmpGrid[index].show = true;
        setShowCount(showCount + 1);
      }

      setGridItems(tmpGrid);
    }
  }
  useEffect(() => {
    if(moveCount > 0 && gridItems.every(item => item.permanentShow === true)) {
      setPlaying(false);
    }
  }, [moveCount, gridItems]);
  const resetAndCreateGrid = () => {
    // passo 1 - resetar o jogo
    setTimeElapsed(0);
    setMovecount(0);
    setShowCount(0);

    // passo 2 - criar o grid
    let tmpGrid: GridItemType[] = [];
    for(let i = 0; i < (items.length * 2); i++) tmpGrid.push({
       item: null, show: false, permanentShow:false 
    });
    for(let j = 0; j < 2; j++) {
      for(let k = 0; k < items.length; k++){
        let pos = -1;
        while(pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = k;
      }
    }
    setGridItems(tmpGrid);

    // passo 3 - começar jogo
    setPlaying(true);
  }

  return(
    <C.Container>
      <C.Info>
        
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt="" />
        </C.LogoLink>
        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Movimentos" value={moveCount.toString()} />
          <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid} />
        </C.InfoArea>
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem 
              key = {index}
              item = {item}
              onClick= {() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}
export default App;