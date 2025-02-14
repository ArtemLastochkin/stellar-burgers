import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import {
  // getIngredientById,
  getIngredients
} from '../../services/burgerConstructorSlice';

export const IngredientDetails: FC = () => {
  const params = useParams();
  const id = params.id;
  const ingredients = useAppSelector(getIngredients);
  const ingredient = ingredients.find((ingredient) => ingredient._id === id);
  /** TODO: взять переменную из стора */
  const ingredientData = ingredient;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
