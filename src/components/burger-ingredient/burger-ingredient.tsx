import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  createNewObjectConstructorItemsIngredients,
  getConstructorItems,
  setConstructorItemsBun,
  setConstructorItemsIngredients
} from '../../services/burgerConstructorSlice';
import { TypeIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const ingredients = useAppSelector(getConstructorItems);
    const isCountIngredients = ingredients.ingredients.filter(
      (e) => e._id === ingredient._id
    ).length;
    const isCountBun = ingredient._id === ingredients.bun._id;

    if (isCountBun) {
      count = 2;
    }

    if (isCountIngredients) {
      count = ingredients.ingredients.filter(
        (e) => e._id === ingredient._id
      ).length;
    }

    const handleAdd = () => {
      if (ingredient.type === TypeIngredient.BUN) {
        const newInitialConstructorItems = {
          bun: {
            price: ingredient.price,
            name: ingredient.name,
            image: ingredient.image,
            _id: ingredient._id
          }
        };
        dispatch(setConstructorItemsBun(newInitialConstructorItems));
      } else {
        const newIngredient = Object.assign(
          {
            id:
              `${ingredient._id}` +
              `-` +
              `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
          },
          ingredient
        );
        const newIngredients = [...ingredients.ingredients, newIngredient];

        dispatch(
          setConstructorItemsIngredients(
            createNewObjectConstructorItemsIngredients(newIngredients)
          )
        );
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
