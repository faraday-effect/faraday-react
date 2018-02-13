// @flow

import type {Action} from "../types/redux";
import {flashError, flashInfo} from "./flash";
import {httpGetAuth} from "../middleware/api";

// Action types
export const GET_COURSES_INIT = 'COURSES/INIT';
export const GET_COURSES_OKAY = 'COURSES/OKAY';
export const GET_COURSES_FAIL = 'COURSES/FAIL';

// Action creators
export const getCourses = () => {
    return async (dispatch: Function) => {
        dispatch({type: GET_COURSES_INIT});

        try {
            const response = await dispatch(httpGetAuth('courses', [GET_COURSES_INIT, GET_COURSES_OKAY, GET_COURSES_FAIL]));
            if (response.ok) {
                dispatch(flashInfo('Got some courses'));
            } else {
                dispatch(flashError(`Unable to get courses (${response.payload.message})`));
            }
        } catch (err) {
            dispatch(flashError(`Unable to get courses from server (${err})`));
        }
    }
};

type Course = {
    _id: string,
    designation: string,
    title: string
};

export type State = Array<Course>;
const initialState: State = [];

export default (state: State = initialState, action: Action) => {
    switch(action.type) {
        case GET_COURSES_OKAY:
            return action.payload;
        case GET_COURSES_FAIL:
            return initialState;
        default:
            return state;
    }
};


