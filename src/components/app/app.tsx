import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams
} from 'react-router-dom';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route';

import { useEffect } from 'react';
import { fetchIngredients } from '../../services/burgerConstructorSlice';
import { useAppDispatch } from '../../services/store';
import { fetchFeeds } from '../../services/feedSlice';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeeds());
  }, []);

  return (
    <>
      <div className={styles.app}>
        <AppHeader />

        <Routes>
          <Route path={'/'} element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route
            path='/login'
            element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
            }
          />

          <Route
            path='/register'
            element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>
            }
          />

          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='/reset-password'
            element={
              <ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path='/feed/:number'
            element={
              <Modal
                title={'#' + location.pathname.slice(6)}
                onClose={() => navigate('/feed', { replace: true })}
              >
                <OrderInfo />
              </Modal>
            }
          />

          {background ? (
            <Route
              path='/ingredients/:id'
              element={
                <Modal
                  title={'Детали ингридиента'}
                  onClose={() => navigate('/', { replace: true })}
                >
                  <IngredientDetails />
                </Modal>
              }
            />
          ) : (
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
          )}

          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={''}
                onClose={() => navigate('/profile/orders', { replace: true })}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
