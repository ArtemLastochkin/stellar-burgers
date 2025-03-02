import rootReducer from '../../src/services/store';
import { initialState as initialStateBurgerSlice } from '../../src/services/burgerConstructorSlice';
import { initialState as initialStateFeedSlice } from '../../src/services/feedSlice';
import { initialState as initialStateUserSlice } from '../../src/services/userSlice';

describe('rootReducer', () => {
  test('initialization burgerConstructorSlice', () => {
    expect(rootReducer.getState().burgerSlice).toEqual(initialStateBurgerSlice);
  });

  test('initialization feedSlice', () => {
    expect(rootReducer.getState().feedSlice).toEqual(initialStateFeedSlice);
  });

  test('initialization userSlice', () => {
    expect(rootReducer.getState().userSlice).toEqual(initialStateUserSlice);
  });
});
