import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { getConstructorItems } from '../../services/burgerConstructorSlice';
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
  const constructorItems = useAppSelector(getConstructorItems);
  const orderRequest = useAppSelector(getStateisLoadingOrder);
  const orderModalData = useAppSelector(getStateOrderModalData);
  const stateIsUserLogined = useAppSelector(getStateIsUserLogined);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!stateIsUserLogined) {
      return navigate('/login');
    }

    if (!constructorItems.bun || orderRequest) {
      return;
    }

    const dataRequest = constructorItems.ingredients.map((e) => e._id);

    for (let i = 0; i < 2; i += 1) {
      dataRequest.push(constructorItems.bun._id);
    }

    dispatch(fetchOrderBurger([...dataRequest]));
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
