import configureMockStore from 'redux-mock-store'
import thunk from "redux-thunk";
import { getStore } from '../store';
import { listWithPagination } from './ducks';

describe('reducers', () => {
    test('increment page', () => {
        const prevState = {
            listA: { data: [], page: 1 },
            listB: { data: [], page: 2 }
        };
        const action = { payload: { name: 'listB', page: 3 } };
        expect(listWithPagination.caseReducers.updateListPage(prevState, action)).toEqual({
            listA: { data: [], page: 1 },
            listB: { data: [], page: 3 },
        });
    });
});

describe('action creators', () => {
    test('load next page', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn().mockReturnValueOnce({ listWithPagination: { listA: { data: [], page: 1 } } });
        await listWithPagination.actions.loadNextPage({ name: 'listA' })(dispatch, getState);
        expect(dispatch.mock.calls.length).toBe(2);
        // console.log(dispatch.mock.calls);
        // [
        //     [{ type: 'lists-with-pagination/updateListPage', payload: [Object] }],
        //     [ [Function: _callee] ]
        // ]
    });

    test('load next page with mockStore', async () => {
        const serverResponse = {
            list: [1, 2],
        };
        const json = () => Promise.resolve(serverResponse);
        global.fetch = () => Promise.resolve({ json })
        const middlewares = [thunk]
        const getMockStore = configureMockStore(middlewares);
        const mockStore = getMockStore({ listWithPagination: { listA: { data: [], page: 1 } } });
        await mockStore.dispatch(listWithPagination.actions.loadNextPage({ name: 'listA' }));
        expect(mockStore.getActions()).toEqual(
            [
                {
                    type: 'lists-with-pagination/updateListPage',
                    payload: { name: 'listA', page: 2 }
                },
                {
                    type: 'lists-with-pagination/updateListRequestStatus',
                    payload: { name: 'listA', requestStatus: 'PENDING' }
                },
                {
                    type: 'lists-with-pagination/updateListData',
                    payload: { name: 'listA', data: [1, 2] }
                },
                {
                    type: 'lists-with-pagination/updateListRequestStatus',
                    payload: { name: 'listA', requestStatus: 'SUCCESS' }
                }
            ]
        )
    });
});

describe('full redux store test', () => {
    test('load next page', async () => {
        const serverResponse = {
            list: [1, 2],
        };
        const json = () => Promise.resolve(serverResponse);
        global.fetch = () => Promise.resolve({ json })
        const store = getStore({ listWithPagination: { listA: { data: [], page: 1 } } });
        await store.dispatch(listWithPagination.actions.loadNextPage({ name: 'listA' }));
        expect(store.getState()).toEqual({ 
            listWithPagination: { 
                listA: { 
                    data: [1, 2], 
                    page: 2, 
                    requestStatus: listWithPagination.REQUEST_STATUS.SUCCESS 
                }
            }
        });
    })
})
