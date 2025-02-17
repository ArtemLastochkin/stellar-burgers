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
import styleOrderDetails from '../ui/order-info/order-info.module.css';
import sryleIngridientDetails from '../ui/ingredient-details/ingredient-details.module.css';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams
} from 'react-router-dom';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route';

import { fetchIngredients } from '../../services/burgerConstructorSlice';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchCheckUserLogined,
  getStateIsLoading
} from '../../services/userSlice';
import { useEffect } from 'react';
import { Preloader } from '@ui';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const background = location.state?.background;
  const isLoading = useAppSelector(getStateIsLoading);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchCheckUserLogined());
  }, []);

  if (isLoading) {
    return (
      <div className={styles.app}>
        <Preloader />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
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
            <ProtectedRoute onlyAuthUser>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute onlyAuthUser>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route path='/feed' element={<Feed />} />

        <Route
          path='/feed/:number'
          element={
            <div className={`${styleOrderDetails.wrap}`}>
              <p
                className={`text text_type_main-large pb-3 pt-10 ${styleOrderDetails.number}`}
              >
                {'#' + location.pathname.slice(6)}
              </p>
              <OrderInfo />
            </div>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <div className={`${sryleIngridientDetails.content}`}>
              <p className={`text text_type_main-large pb-3 pt-10`}>
                Детали ингредиента
              </p>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <div className={`${styleOrderDetails.wrap}`}>
              <p
                className={`text text_type_main-large pb-3 pt-10 ${styleOrderDetails.number}`}
              >
                {'#' + location.pathname.slice(16)}
              </p>
              <OrderInfo />
            </div>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/*                                                    модальные окна                                                        */}

      {background && (
        <Routes>
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

          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title={'Детали ингредиента'}
                onClose={() => navigate('/', { replace: true })}
              >
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={'#' + location.pathname.slice(16)}
                onClose={() => navigate('/profile/orders', { replace: true })}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
