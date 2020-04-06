import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
const REQUEST_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

const addList = (state, action) => ({
  ...state,
  lists: [...state.lists, {
    name: action.payload.name,
    offset: 0,
    limit: 0,
    total: 0,
    page: 0,
    data: [],
    url: !!action.payload.url && action.payload.url,
    requestStatus: false
  }]
});

const updateList = (state, action) => {
  const { listName, data } = action.payload
  const index = state.lists.findIndex(list => list.name === listName)

  return {
    ...state, lists: [
      ...state.lists.slice(0, index),
      { ...state.lists[index], ...data },
      ...state.lists.slice(index + 1),
    ]
  };
};


const listSelector = listName => createSelector(state => state.lists, lists => lists.find(list => list.name === listName));

const load = createAsyncThunk(
  'lists-with-pagination/load',
  async (listName, thunkAPI) => {
    const url = thunkAPI.getState().listWithPagination.lists.find(list => list.name === listName);
    const response = await fetch(url, {}); // todo offset limit etc
    return await response.json();
  }
)

const listWithPagination = createSlice({
  name: 'lists-with-pagination',
  initialState: {
    lists: [],
  },
  reducers: {
    addList,
    updateList
  },
  extraReducers: {
    [load.fulfilled]: (state, action) => {
      const listName = action.meta.arg;
      return updateList(state, {payload: {listName, data: {...action.payload, requestStatus: REQUEST_STATUS.SUCCESS}} });
    },
    [load.pending]: (state, action) => {
      const listName = action.meta.arg;
      return updateList(state, {payload: {listName, data: {requestStatus: REQUEST_STATUS.PENDING}} });
    }
  },
});
listWithPagination.actions.load = load;
listWithPagination.REQUEST_STATUS = REQUEST_STATUS;
listWithPagination.actions.next = ({ listName }) => async (dispatch, getState) => {
  // increase offset
  // trigger load
};
listWithPagination.actions.prev = ({ listName }) => async (dispatch, getState) => {
  // decrese offset
  // trigger load
};
export { listWithPagination, listSelector };
