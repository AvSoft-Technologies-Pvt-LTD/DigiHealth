import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'Patient' | 'Hospital' | 'Doctor' | 'Labs/Scan';

interface UserState {
  selectedRole: UserRole | null;
  isAuthenticated: boolean;
  userProfile: {
    id: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
}

const initialState: UserState = {
  selectedRole: null,
  isAuthenticated: false,
  userProfile: {
    id: null,
    name: null,
    email: null,
    phone: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<UserRole>) => {
      state.selectedRole = action.payload;
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<Partial<UserState['userProfile']>>) => {
      state.userProfile = { ...state.userProfile, ...action.payload };
    },
    clearUserData: (state) => {
      state.selectedRole = null;
      state.isAuthenticated = false;
      state.userProfile = {
        id: null,
        name: null,
        email: null,
        phone: null,
      };
    },
  },
});

export const {
  setSelectedRole,
  clearSelectedRole,
  setAuthenticated,
  setUserProfile,
  clearUserData,
} = userSlice.actions;

export default userSlice.reducer;
