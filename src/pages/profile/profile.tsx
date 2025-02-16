import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchRegisterUserApi,
  fetchUpdateUserApi,
  getStateEmail,
  getStateName
} from '../../services/userSlice';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useAppDispatch();
  const userName = useAppSelector(getStateName);
  const useEmail = useAppSelector(getStateEmail);

  const [formValue, setFormValue] = useState({
    name: userName,
    email: useEmail,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: userName || '',
      email: useEmail || ''
    }));
  }, [userName, useEmail]);

  const isFormChanged =
    formValue.name !== userName ||
    formValue.email !== useEmail ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(fetchUpdateUserApi(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: userName,
      email: useEmail,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
