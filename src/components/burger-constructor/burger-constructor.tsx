import { FC, useEffect, useLayoutEffect, useMemo } from 'react';
import { TConstructorIngredient, TypeIngredient } from '@utils-types';
import { BurgerConstructorUI, Preloader } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  getConstructorItems,
  getIngredients,
  setConstructorItemsBun,
  TConstructorItems
} from '../../services/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const initialConstructorItems = useAppSelector(getConstructorItems);
  const ingredients = useAppSelector(getIngredients);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const bunInitial = ingredients.find((e) => e.type === TypeIngredient.BUN);
    if (bunInitial) {
      const bunPrice = bunInitial.price;
      const bunName = bunInitial.name;
      const bunImage = bunInitial.image;
      const bunId = bunInitial._id;
      const newInitialConstructorItems: Pick<
        TConstructorItems,
        TypeIngredient.BUN
      > = {
        bun: { price: bunPrice, name: bunName, image: bunImage, _id: bunId }
      };
      dispatch(setConstructorItemsBun(newInitialConstructorItems));
    }
  }, [ingredients]);

  const constructorItems: TConstructorItems = {
    bun: {
      price: initialConstructorItems.bun.price,
      name: initialConstructorItems.bun.name,
      image: initialConstructorItems.bun.image,
      _id: initialConstructorItems.bun._id
    },
    ingredients: initialConstructorItems.ingredients
  };

  const orderRequest = false;

  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }
  };
  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
