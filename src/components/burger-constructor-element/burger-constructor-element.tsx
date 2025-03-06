import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useAppDispatch } from '../../services/store';
import {
  delConstructorItemsIngredient,
  setConstructorItemsIngredient
} from '../../services/burgerConstructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useAppDispatch();

    const handleMoveDown = () => {
      dispatch(delConstructorItemsIngredient(index));
      dispatch(
        setConstructorItemsIngredient({
          index: index + 1,
          ingredient: ingredient
        })
      );
    };

    const handleMoveUp = () => {
      dispatch(delConstructorItemsIngredient(index));
      dispatch(
        setConstructorItemsIngredient({
          index: index - 1,
          ingredient: ingredient
        })
      );
    };

    const handleClose = () => {
      dispatch(delConstructorItemsIngredient(index));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
