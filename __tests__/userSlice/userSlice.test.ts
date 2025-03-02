import {
  configureStore,
  EnhancedStore,
  StoreEnhancer,
  ThunkDispatch,
  Tuple,
  UnknownAction
} from '@reduxjs/toolkit';
import { TUser } from '../../src/utils/types';
import userDataMock from './userData.json';
import userSlice, {
  fetchCheckUserLogined,
  fetchLoginUserApi,
  fetchlogoutApi,
  fetchRegisterUserApi,
  fetchUpdateUserApi,
  getStateEmail,
  getStateErrorMessageRegister,
  getStateIsLoading,
  getStateIsUserLogined,
  getStateName
} from '../../src/services/userSlice';

describe('[feedSlice]', () => {
  const {
    initialStateMock,
    registerDataMock,
    authResponseMock,
    loginDataMock,
    userResponseMock,
    notInitialStateMock
  } = userDataMock.userDataMock;

  const createMockStore = (
    state: TUser & {
      errorMessage: string;
      isUserLogined: boolean;
      isLoading: boolean;
    }
  ) =>
    configureStore({
      reducer: userSlice,
      preloadedState: state
    });

  let store: EnhancedStore<
    any,
    UnknownAction,
    Tuple<
      [
        StoreEnhancer<{
          dispatch: ThunkDispatch<any, undefined, UnknownAction>;
        }>,
        StoreEnhancer
      ]
    >
  >;
  beforeEach(() => {
    store = createMockStore(initialStateMock);
  });

  // // ******************************************* Тесты Async-редьюсеров в userSlice *******************************************

  describe('[reducersAsync]', () => {
    describe('[reducersAsync.fetchRegisterUserApi]', () => {
      test('fetchRegisterUserApi.pending', async () => {
        store = createMockStore({
          ...initialStateMock,
          isLoading: false,
          isUserLogined: true
        });
        expect(store.getState().isLoading).toBe(false);
        expect(store.getState().isUserLogined).toBe(true);
        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchRegisterUserApi.pending(
                'fetchRegisterUserApi.pending',
                registerDataMock
              )
            )
        );
        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoading).toBe(true);
        expect(store.getState().isUserLogined).toBe(false);
      });
      test('fetchRegisterUserApi.fulfilled', async () => {
        expect(store.getState().errorMessage).not.toBeNull();
        expect(store.getState().isLoading).toBe(true);
        expect(store.getState().isUserLogined).not.toBe(
          authResponseMock.success
        );
        expect(store.getState().email).not.toBe(authResponseMock.user.email);
        expect(store.getState().name).not.toBe(authResponseMock.user.name);
        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchRegisterUserApi.fulfilled(
                authResponseMock,
                'fetchRegisterUserApi.fulfilled',
                registerDataMock
              )
            )
        );

        fetch();

        const { errorMessage, isLoading, isUserLogined, email, name } =
          store.getState();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(errorMessage).toEqual('');
        expect(isLoading).toBe(false);
        expect(isUserLogined).toBe(authResponseMock.success);
        expect(email).toBe(authResponseMock.user.email);
        expect(name).toBe(authResponseMock.user.name);
      });
      test('fetchRegisterUserApi.rejected', async () => {
        store = createMockStore({
          ...initialStateMock,
          errorMessage: '',
          isLoading: true,
          isUserLogined: true
        });

        expect(store.getState().errorMessage).toBe('');
        expect(store.getState().isLoading).toBe(true);
        expect(store.getState().isUserLogined).toBe(true);
        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchRegisterUserApi.rejected(
                new Error('Ошибка авторизации'),
                'fetchRegisterUserApi.rejected',
                registerDataMock
              )
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().errorMessage).toBe('Ошибка авторизации');
        expect(store.getState().isLoading).toBe(false);
        expect(store.getState().isUserLogined).toBe(false);
      });
    });

    describe('[reducersAsync.fetchLoginUserApi]', () => {
      test('fetchLoginUserApi.pending', async () => {
        store = createMockStore({
          ...initialStateMock,
          isLoading: false,
          isUserLogined: true
        });
        expect(store.getState().isLoading).toBe(false);
        expect(store.getState().isUserLogined).toBe(true);
        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchLoginUserApi.pending(
                'fetchLoginUserApi.pending',
                loginDataMock
              )
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoading).toBe(true);
        expect(store.getState().isUserLogined).toBe(false);
      });

      test('fetchLoginUserApi.fulfilled', async () => {
        store = createMockStore({
          ...initialStateMock,
          errorMessage: 'fail',
          isUserLogined: false,
          isLoading: true,
          email: 'email',
          name: 'name'
        });

        expect(store.getState().errorMessage).toBe('fail');
        expect(store.getState().isUserLogined).toBe(false);
        expect(store.getState().isLoading).toBe(true);
        expect(store.getState().email).toBe('email');
        expect(store.getState().name).toBe('name');
        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchLoginUserApi.fulfilled(
                authResponseMock,
                'fetchLoginUserApi.fulfilled',
                loginDataMock
              )
            )
        );

        fetch();

        expect(store.getState().errorMessage).toBe('');
        expect(store.getState().isUserLogined).toBe(true);
        expect(store.getState().isLoading).toBe(false);
        expect(store.getState().email).toBe(authResponseMock.user.email);
        expect(store.getState().name).toBe(authResponseMock.user.name);
      });

      test('fetchLoginUserApi.rejected', async () => {
        // .addCase(fetchLoginUserApi.rejected, (state, action) => {
        //   state.errorMessage = String(action.error.message);
        //   state.isUserLogined = false;
        //   state.isLoading = false;
        // })
        store = createMockStore({
          ...initialStateMock,
          isUserLogined: true
        });
        expect(store.getState().errorMessage).toBe('');
        expect(store.getState().isUserLogined).toBe(true);
        expect(store.getState().isLoading).toBe(true);
        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchLoginUserApi.rejected(
                new Error('Failed'),
                'fetchLoginUserApi.rejected',
                loginDataMock
              )
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().errorMessage).toBe('Failed');
        expect(store.getState().isUserLogined).toBe(false);
        expect(store.getState().isLoading).toBe(false);
      });
    });

    describe('[reducersAsync.fetchCheckUserLogined]', () => {
      test('fetchCheckUserLogined.pending', async () => {
        store = createMockStore({
          ...initialStateMock,
          isLoading: false,
          isUserLogined: true
        });
        expect(store.getState().isLoading).toBe(false);
        expect(store.getState().isUserLogined).toBe(true);

        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchCheckUserLogined.pending('fetchCheckUserLogined.pending')
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoading).not.toBe(false);
        expect(store.getState().isUserLogined).not.toBe(true);
      });

      test('fetchCheckUserLogined.fulfilled', async () => {
        expect(store.getState().isLoading).toBe(true);
        expect(store.getState().isUserLogined).toBe(false);
        expect(store.getState().email).toBe('');
        expect(store.getState().name).toBe('');

        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchCheckUserLogined.fulfilled(
                userResponseMock,
                'fetchCheckUserLogined.fulfilled'
              )
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoading).toBe(false);
        expect(store.getState().isUserLogined).toBe(true);
        expect(store.getState().email).toBe(userResponseMock.user.email);
        expect(store.getState().name).toBe(userResponseMock.user.name);
      });

      test('fetchCheckUserLogined.rejected', async () => {
        store = createMockStore({
          ...initialStateMock,
          isUserLogined: true,
          isLoading: true
        });
        expect(store.getState().isUserLogined).toBe(true);
        expect(store.getState().isLoading).toBe(true);

        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchCheckUserLogined.rejected(
                new Error(),
                'fetchCheckUserLogined.rejected'
              )
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isUserLogined).toBe(false);
        expect(store.getState().isLoading).toBe(false);
      });
    });

    describe('[reducersAsync.fetchUpdateUserApi]', () => {
      test('fetchUpdateUserApi.pending', async () => {
        store = createMockStore({
          ...initialStateMock,
          isLoading: false
        });
        expect(store.getState().isLoading).toBe(false);

        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchUpdateUserApi.pending(
                'fetchUpdateUserApi.pending',
                registerDataMock
              )
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoading).toBe(true);
      });

      test('fetchUpdateUserApi.fulfilled', async () => {
        expect(store.getState().isLoading).toBe(true);
        expect(store.getState().email).toBe('');
        expect(store.getState().name).toBe('');
        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchUpdateUserApi.fulfilled(
                userResponseMock,
                'fetchUpdateUserApi.fulfilled',
                registerDataMock
              )
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoading).toBe(false);
        expect(store.getState().email).toBe(userResponseMock.user.email);
        expect(store.getState().name).toBe(userResponseMock.user.name);
      });

      test('fetchUpdateUserApi.rejected', async () => {
        expect(store.getState().isLoading).toBe(true);

        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchUpdateUserApi.rejected(
                new Error(),
                'fetchUpdateUserApi.rejected',
                registerDataMock
              )
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoading).toBe(false);
      });
    });

    describe('[reducersAsync.fetchlogoutApi]', () => {
      test('fetchlogoutApi.pending', async () => {
        store = createMockStore({
          ...initialStateMock,
          isLoading: false
        });
        expect(store.getState().isLoading).toBe(false);
        expect(store.getState().isUserLogined).toBe(false);

        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchlogoutApi.pending('fetchlogoutApi.pending')
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoading).toBe(true);
        expect(store.getState().isUserLogined).toBe(true);
      });

      test('fetchlogoutApi.fulfilled', async () => {
        store = createMockStore({
          ...initialStateMock,
          isUserLogined: true
        });
        expect(store.getState().isLoading).toBe(true);
        expect(store.getState().isUserLogined).toBe(true);
        expect(store.getState().email).toBe('');
        expect(store.getState().name).toBe('');
        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchlogoutApi.fulfilled(
                userResponseMock,
                'fetchlogoutApi.fulfilled'
              )
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoading).toBe(false);
        expect(store.getState().isUserLogined).toBe(false);
        expect(store.getState().email).not.toBe(userResponseMock.user.email);
        expect(store.getState().name).not.toBe(userResponseMock.user.name);
      });

      test('fetchlogoutApi.rejected', async () => {
        expect(store.getState().isLoading).toBe(true);
        expect(store.getState().isUserLogined).toBe(false);

        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchlogoutApi.rejected(new Error(), 'fetchlogoutApi.rejected')
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoading).toBe(false);
        expect(store.getState().isUserLogined).toBe(true);
      });
    });
  });
  // ******************************************* Тесты селекторов в userSlice *******************************************
  describe('[selectors]', () => {
    beforeEach(() => {
      store = createMockStore(notInitialStateMock);
    });

    const getStateErrorMessageRegisterMock = jest.fn(() =>
      getStateErrorMessageRegister({ userSlice: store.getState() })
    );

    const getStateIsUserLoginedMock = jest.fn(() =>
      getStateIsUserLogined({ userSlice: store.getState() })
    );

    const getStateIsLoadingMock = jest.fn(() =>
      getStateIsLoading({ userSlice: store.getState() })
    );

    const getStateNameMock = jest.fn(() =>
      getStateName({ userSlice: store.getState() })
    );

    const getStateEmailMock = jest.fn(() =>
      getStateEmail({ userSlice: store.getState() })
    );

    test('getStateErrorMessageRegister', () => {
      expect(store.getState().errorMessage).toBe(
        notInitialStateMock.errorMessage
      );
      getStateErrorMessageRegisterMock();
      expect(getStateErrorMessageRegisterMock).toHaveBeenCalled();
      expect(getStateErrorMessageRegisterMock).toHaveBeenCalledTimes(1);
      expect(getStateErrorMessageRegisterMock()).toEqual(
        notInitialStateMock.errorMessage
      );
    });

    test('getStateIsUserLogined', () => {
      expect(store.getState().isUserLogined).toEqual(
        notInitialStateMock.isUserLogined
      );
      getStateIsUserLoginedMock();
      expect(getStateIsUserLoginedMock).toHaveBeenCalled();
      expect(getStateIsUserLoginedMock).toHaveBeenCalledTimes(1);
      expect(getStateIsUserLoginedMock()).toEqual(
        notInitialStateMock.isUserLogined
      );
    });

    test('getStateIsLoading', () => {
      expect(store.getState().isLoading).toBe(notInitialStateMock.isLoading);
      getStateIsLoadingMock();
      expect(getStateIsLoadingMock).toHaveBeenCalled();
      expect(getStateIsLoadingMock).toHaveBeenCalledTimes(1);
      expect(getStateIsLoadingMock()).toEqual(notInitialStateMock.isLoading);
    });

    test('getStateName', () => {
      expect(store.getState().name).toBe(notInitialStateMock.name);
      getStateNameMock();
      expect(getStateNameMock).toHaveBeenCalled();
      expect(getStateNameMock).toHaveBeenCalledTimes(1);
      expect(getStateNameMock()).toEqual(notInitialStateMock.name);
    });

    test('getStateEmail', () => {
      expect(store.getState().email).toBe(notInitialStateMock.email);
      getStateEmailMock();
      expect(getStateEmailMock).toHaveBeenCalled();
      expect(getStateEmailMock).toHaveBeenCalledTimes(1);
      expect(getStateEmailMock()).toEqual(notInitialStateMock.email);
    });
  });
});
