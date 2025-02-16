import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient, TypeIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  getConstructorItems,
  getIngredients,
  setConstructorItemsBun,
  TConstructorItems
} from '../../services/burgerConstructorSlice';
import {
  fetchOrderBurger,
  getStateisLoadingOrder,
  getStateOrderModalData,
  resetOrderisLoadingOrder,
  resetOrderModalData
} from '../../services/feedSlice';
import { getStateIsUserLogined } from '../../services/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const initialConstructorItems = useAppSelector(getConstructorItems);
  const ingredients = useAppSelector(getIngredients);
  const orderRequest = useAppSelector(getStateisLoadingOrder);
  const orderModalData = useAppSelector(getStateOrderModalData);
  const stateIsUserLogined = useAppSelector(getStateIsUserLogined);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    } else {
      const dataRequest = initialConstructorItems.ingredients.map((e) => e._id);
      for (let i = 0; i < 2; i += 1) {
        dataRequest.push(initialConstructorItems.bun._id);
      }
      stateIsUserLogined
        ? dispatch(fetchOrderBurger([...dataRequest]))
        : navigate('/login');
    }
  };

  const closeOrderModal = () => {
    dispatch(resetOrderisLoadingOrder());
    dispatch(resetOrderModalData());
  };

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
