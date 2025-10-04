import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'Patient' | 'Hospital' | 'Doctor' | 'Labs/Scan';

interface UserState {
  isAuthenticated: boolean;
  userProfile: {
    userId: string | null;
    patientId: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    role?: UserRole | null;
  };
}

const initialState: UserState = {
  isAuthenticated: false,
  userProfile: {
    userId: null,
    patientId: null,
    name: null,
    email: null,
    phone: null,
    role: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<UserRole>) => {
      state.userProfile.role = action.payload;
    },
    clearSelectedRole: (state) => {
      state.userProfile.role = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<Partial<UserState['userProfile']>>) => {
      state.userProfile = { ...state.userProfile, ...action.payload };
    },
    clearUserData: (state) => {
      state.isAuthenticated = false;
      state.userProfile = {
        userId: null,
        patientId: null,
        name: null,
        email: null,
        phone: null,
        role: null,
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
