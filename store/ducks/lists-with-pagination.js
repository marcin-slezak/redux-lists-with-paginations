import { createSlice, createSelector } from '@reduxjs/toolkit';
const REQUEST_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

const addList = (state, action) => {
  const { name, url } = action.payload;
  return {
    ...state,
    [name]: {
      data: [],
      page: 0,
      requestStatus: false,
      url,
    }
  }
};

const updateListData = (state, action) => {
  const { name, data } = action.payload

  return {
    ...state,
    [name]: {
      ...state[name],
      data
    }
  }
};

const updateListPage = (state, action) => {
  const { name, page } = action.payload

  return {
    ...state,
    [name]: {
      ...state[name],
      page
    }
  }
};

const updateListRequestStatus = (state, action) => {
  const { name, requestStatus } = action.payload

  return {
    ...state,
    [name]: {
      ...state[name],
      requestStatus
    }
  }
};

const getListDataSelector = listName => createSelector(state => state[listName], lists => lists.data);


const listWithPagination = createSlice({
  name: 'lists-with-pagination',
  initialState: {},
  reducers: {
    addList,
    updateListData,
    updateListPage,
    updateListRequestStatus,
  }
});

listWithPagination.REQUEST_STATUS = REQUEST_STATUS;

listWithPagination.actions.load = ({ name }) => async (dispatch, getState) => {
  const { url, page} = getState().listWithPagination[name];
  dispatch(listWithPagination.actions.updateListRequestStatus({ name, requestStatus: REQUEST_STATUS.PENDING }));
  try{
    const response = await fetch(url, {method: 'POST', body: {page}});
    const responseData = await response.json();
    dispatch(listWithPagination.actions.updateListData({ name, data: responseData.list }));
    dispatch(listWithPagination.actions.updateListRequestStatus({ name, requestStatus: REQUEST_STATUS.SUCCESS }));
  }catch(e){
    dispatch(listWithPagination.actions.updateListRequestStatus({ name, requestStatus: REQUEST_STATUS.FAILED }));
  }
};

listWithPagination.actions.loadNextPage = ({ name }) => async (dispatch, getState) => {
  const nextPage = getState().listWithPagination[name].page + 1;
  dispatch(listWithPagination.actions.updateListPage({ name, page: nextPage}));
  dispatch(listWithPagination.actions.load({ name }));
};

export { listWithPagination, getListDataSelector };
