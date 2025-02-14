import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useAppSelector, useAppDispatch } from '../../services/store';
import {
  createNewObjectConstructorItemsIngredients,
  getConstructorItems,
  setConstructorItemsIngredients,
  TConstructorItems
} from '../../services/burgerConstructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const initialConstructorItems = useAppSelector(getConstructorItems);
    const dispatch = useAppDispatch();

    const handleMoveDown = () => {};

    const handleMoveUp = () => {};

    const handleClose = () => {
      const newIngredients = initialConstructorItems.ingredients.filter(
        (e) => e !== ingredient
      );

      dispatch(
        setConstructorItemsIngredients(
          createNewObjectConstructorItemsIngredients(newIngredients)
        )
      );
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
