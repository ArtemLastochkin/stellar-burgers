import { initialState as initialStateBurgerSlice } from '../../src/services/burgerConstructorSlice';
import { initialState as initialStateFeedSlice } from '../../src/services/feedSlice';
import { initialState as initialStateUserSlice } from '../../src/services/userSlice';
import store from '../../src/services/store';

describe('rootReducer', () => {
  test('rootReducer', () => {
    const init = { type: 'init' };
    store.dispatch(init);

    expect(store.getState()).toEqual({
      burgerSlice: initialStateBurgerSlice,
      feedSlice: initialStateFeedSlice,
      userSlice: initialStateUserSlice
    });
  });
});
