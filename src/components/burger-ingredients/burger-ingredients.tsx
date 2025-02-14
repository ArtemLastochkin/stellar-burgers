import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode, TypeIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '../../services/store';
import {
  // getIngredientsTypeBun,
  // getIngredientsTypeMains,
  // getIngredientsTypeSauce
  getIngredients
} from '../../services/burgerConstructorSlice';

export const BurgerIngredients: FC = () => {
  /** TODO: взять переменные из стора */
  const ingredients = useAppSelector(getIngredients);
  const buns = ingredients.filter((e) => e.type === TypeIngredient.BUN);
  const sauces = ingredients.filter((e) => e.type === TypeIngredient.SAUCE);
  const mains = ingredients.filter((e) => e.type === TypeIngredient.MAIN);

  const [currentTab, setCurrentTab] = useState<TTabMode>(TypeIngredient.BUN);
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab(TypeIngredient.BUN);
    } else if (inViewSauces) {
      setCurrentTab(TypeIngredient.SAUCE);
    } else if (inViewFilling) {
      setCurrentTab(TypeIngredient.MAIN);
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === TypeIngredient.BUN)
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === TypeIngredient.MAIN)
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === TypeIngredient.SAUCE)
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
