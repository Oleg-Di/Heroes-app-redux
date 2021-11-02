import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { useHttp } from './../hooks/http.hook';





const filterAdapter = createEntityAdapter()

const initialState = filterAdapter.getInitialState({
    filterStatus: 'idle',
    activeFilter: 'all'
});

export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    async () => {
        const {request} = useHttp();
        return await request('http://localhost:3001/filters')
    }
);

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setFilterStatus: (state, action) => {
            state.activeFilter = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchFilters.pending, state => {state.filterStatus = 'loading'})
        .addCase(fetchFilters.fulfilled, (state, action) => {
            state.filterStatus = 'idle';
            filterAdapter.setAll(state, action.payload)
        })
        .addCase(fetchFilters.rejected, state=> {
            state.filterStatus = 'error'
        })
        .addDefaultCase(()=>{})
    }
    
});

const {actions, reducer} = filterSlice;
export const {selectAll} = filterAdapter.getSelectors(state => state.filters)

export default reducer;

export const {
    setFilterStatus
} = actions;
