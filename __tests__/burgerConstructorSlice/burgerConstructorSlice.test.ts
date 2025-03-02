import burgerConstructorSlice, {
  IburgerConstructorState,
  setConstructorItemsBun,
  TConstructorItems,
  setConstructorItemsIngredients,
  fetchIngredients,
  getIngredients,
  getConstructorItems,
  getStateIsLoadingIngredients,
  createNewObjectConstructorItemsIngredients
} from '../../src/services/burgerConstructorSlice';
import '../../src/services/store';
import {
  configureStore,
  EnhancedStore,
  StoreEnhancer,
  ThunkDispatch,
  Tuple,
  UnknownAction
} from '@reduxjs/toolkit';
import { TypeIngredient } from '../../src/utils/types';
import ingredientsMock from './burgerIngredients.json';
import { fetchOrderBurger } from '../../src/services/feedSlice';

describe('[burgerConstructorSlice]', () => {
  const initialState = {
    ingredients: [],
    constructorItems: {
      bun: {
        price: 0,
        name: '',
        image: '',
        _id: ''
      },
      ingredients: []
    },
    isLoading: false,
    errorMessage: ''
  };

  let newState: IburgerConstructorState | undefined;

  const createMockStore = (state: IburgerConstructorState) =>
    configureStore({
      reducer: burgerConstructorSlice,
      preloadedState: state
    });

  let store: EnhancedStore<
    IburgerConstructorState,
    UnknownAction,
    Tuple<
      [
        StoreEnhancer<{
          dispatch: ThunkDispatch<
            IburgerConstructorState,
            undefined,
            UnknownAction
          >;
        }>,
        StoreEnhancer
      ]
    >
  >;

  beforeEach(() => {
    store = createMockStore(initialState);
  });

  const { bun, ingredientsWithoutId } = ingredientsMock.ingredientsData;
  const bunMock: Pick<TConstructorItems, TypeIngredient.BUN> = { bun: bun };
  const { ingredients }: Pick<TConstructorItems, 'ingredients'> =
    ingredientsMock.ingredientsData;

  // ******************************************* Тесты редьюсеров в burgerConstructorSlice *******************************************

  describe('[reducers]', () => {
    test('setConstructorItemsBun', () => {
      const setConstructorItemsBunMock = jest.fn((arg) =>
        setConstructorItemsBun(arg)
      );
      newState = burgerConstructorSlice(
        initialState,
        setConstructorItemsBunMock(bunMock)
      );

      expect(setConstructorItemsBunMock).toHaveBeenCalled();
      expect(setConstructorItemsBunMock).toHaveBeenCalledTimes(1);
      expect(newState).toEqual({
        ingredients: [],
        constructorItems: {
          bun: bun,
          ingredients: []
        },
        isLoading: false,
        errorMessage: ''
      });
    });

    test('setConstructorItemsIngredients', () => {
      const setConstructorItemsIngredientsMock = jest.fn((arg) =>
        setConstructorItemsIngredients(arg)
      );
      newState = burgerConstructorSlice(
        newState,
        setConstructorItemsIngredientsMock({ ingredients: ingredients })
      );

      expect(setConstructorItemsIngredientsMock).toHaveBeenCalled();
      expect(setConstructorItemsIngredientsMock).toHaveBeenCalledTimes(1);
      expect(newState).toEqual({
        ingredients: [],
        constructorItems: {
          bun: bun,
          ingredients: ingredients
        },
        isLoading: false,
        errorMessage: ''
      });
    });
  });

  // ******************************************* Тесты Async-редьюсеров в burgerConstructorSlice *******************************************

  describe('[reducersAsync]', () => {
    test('fetchIngredients.pending', async () => {
      const fetch = jest.fn(
        async () =>
          await store.dispatch(
            fetchIngredients.pending('fetchIngredients.pending')
          )
      );

      fetch();

      const { errorMessage, isLoading } = store.getState();

      expect(fetch).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(errorMessage).toBe(null);
      expect(isLoading).toBe(true);
    });

    test('fetchIngredients.fulfilled', async () => {
      const fetch = jest.fn(
        async () =>
          await store.dispatch(
            fetchIngredients.fulfilled(
              ingredientsWithoutId,
              'fetchIngredients.fulfilled'
            )
          )
      );

      fetch();

      const { ingredients, isLoading, errorMessage } = store.getState();

      expect(fetch).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(errorMessage).toBe(null);
      expect(isLoading).toBe(false);
      expect(ingredients).toEqual(ingredientsWithoutId);
    });

    test('fetchIngredients.rejected', async () => {
      const fetch = jest.fn(
        async () =>
          await store.dispatch(
            fetchIngredients.rejected(new Error(), 'fetchIngredients.rejected')
          )
      );

      fetch();

      const { errorMessage, isLoading } = store.getState();
      expect(fetch).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(errorMessage).toBe('Нет данных об ингридиетах');
      expect(isLoading).toBe(false);
    });

    test('fetchOrderBurger.fulfilled', async () => {
      const { TNewOrderResponse } = ingredientsMock.ingredientsData;
      const { ingredients } =
        ingredientsMock.ingredientsData.TNewOrderResponse.order;

      const setConstructorItemsBunMock = jest.fn((arg) =>
        setConstructorItemsBun(arg)
      );
      store.dispatch(setConstructorItemsBunMock(bunMock));

      const fetch = jest.fn(
        async () =>
          await store.dispatch(
            fetchOrderBurger.fulfilled(
              TNewOrderResponse,
              'fetchOrderBurger.fulfilled',
              ingredients
            )
          )
      );

      fetch();

      const { constructorItems } = store.getState();

      expect(setConstructorItemsBunMock).toHaveBeenCalled();
      expect(setConstructorItemsBunMock).toHaveBeenCalledTimes(1);
      expect(setConstructorItemsBunMock).toHaveBeenCalledWith(bunMock);

      expect(fetch).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledTimes(1);

      expect(constructorItems).toEqual(initialState.constructorItems);
    });
  });

  // ******************************************* Тесты селекторов в burgerConstructorSlice *******************************************

  describe('[selectors]', () => {
    store = createMockStore({
      ingredients: ingredientsWithoutId,
      constructorItems: {
        bun: bun,
        ingredients: ingredients
      },
      isLoading: true,
      errorMessage: 'Ошибка'
    });
    const getIngredientsMock = jest.fn(() =>
      getIngredients({ burgerSlice: store.getState() })
    );
    const getConstructorItemsMock = jest.fn(() =>
      getConstructorItems({ burgerSlice: store.getState() })
    );
    const getStateIsLoadingIngredientsMock = jest.fn(() =>
      getStateIsLoadingIngredients({ burgerSlice: store.getState() })
    );

    test('getIngredients', () => {
      getIngredientsMock();

      expect(getIngredientsMock).toHaveBeenCalled();
      expect(getIngredientsMock).toHaveBeenCalledTimes(1);
      expect(getIngredientsMock()).toEqual(store.getState().ingredients);
    });

    test('getConstructorItems', () => {
      getConstructorItemsMock();

      expect(getConstructorItemsMock).toHaveBeenCalled();
      expect(getConstructorItemsMock).toHaveBeenCalledTimes(1);
      expect(getConstructorItemsMock()).toEqual(
        store.getState().constructorItems
      );
    });

    test('getStateIsLoadingIngredients', () => {
      getStateIsLoadingIngredientsMock();

      expect(getStateIsLoadingIngredientsMock).toHaveBeenCalled();
      expect(getStateIsLoadingIngredientsMock).toHaveBeenCalledTimes(1);
      expect(getStateIsLoadingIngredientsMock()).toEqual(
        store.getState().isLoading
      );
    });
  });

  // ******************************************* Вспомогательные функции в burgerConstructorSlice *******************************************

  describe('[utils]', () => {
    const fn = jest.fn((arg) =>
      createNewObjectConstructorItemsIngredients(arg)
    );
    const resault = fn(ingredients);
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resault).toEqual({ ingredients: ingredients });
  });
});
