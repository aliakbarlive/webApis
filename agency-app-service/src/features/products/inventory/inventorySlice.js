import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    inventory: { rows: [] },
    loading: true,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setInventory: (state, action) => {
      state.inventory = action.payload;
    },
    setProductNames: (state, action) => {
      state.productNames = action.payload;
    },
  },
});

export const { setLoading, setInventory, setProductNames } =
  inventorySlice.actions;

export const getInventoryAsync = (params) => async (dispatch, getState) => {
  dispatch(setLoading(true));

  try {
    const res = await axios({
      method: 'GET',
      url: '/inventory',
      params: {
        ...params,
        accountId: getState().accounts.currentAccount.accountId,
        marketplace: getState().accounts.currentMarketplace.details.countryCode,
      },
    });

    dispatch(setInventory(res.data.data));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.message);
  }
};

export const getProductNamesAsync = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios({
      method: 'GET',
      url: '/inventory/product-names',
    });

    dispatch(setProductNames(res.data.data));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.message);
  }
};

export const updateInventoryAsync =
  (inventory) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      await axios({
        method: 'PUT',
        url: `/inventory/${inventory.inventoryItemId}`,
        data: {
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
          ...inventory,
        },
      });
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error.message);
    }
  };

export const selectInventory = (state) => state.inventory.inventory;
export const selectLoading = (state) => state.inventory.loading;
export const selectProductNames = (state) => state.inventory.productNames;

export default inventorySlice.reducer;
