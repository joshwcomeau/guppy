// @flow
import * as actions from './index';

// take a function and get its return type
/* eslint-disable no-redeclare */
declare function returnType<V>(string): V;
declare function returnType<V>(() => V): V;
declare function returnType<V>((arg1: any) => V): V;
declare function returnType<V>((arg1: any, arg2: any) => V): V;
declare function returnType<V>((arg1: any, arg2: any, arg3: any) => V): V;
declare function returnType<V>(
  (arg1: any, arg2: any, arg3: any, arg4: any) => V
): V;
declare function returnType<V>(
  (arg1: any, arg2: any, arg3: any, arg4: any, arg5: any) => V
): V;
/* eslint-enable */

export type ReturnType<T> = $Call<typeof returnType, T>;

export type Actions = $ObjMap<typeof actions, typeof returnType>;

// the Action type is the union of the values of the return types of the action creators
export type Action = $Values<Actions>;

// take a function and return its arguments in an array
/* eslint-disable no-redeclare */
declare function arguments(() => any): [];
declare function arguments<A>((A) => any): [A];
declare function arguments<A, B>((A, B) => any): [A, B];
declare function arguments<A, B, C>((A, B, C) => any): [A, B, C];
declare function arguments<A, B, C, D>((A, B, C, D) => any): [A, B, C, D];
declare function arguments<A, B, C, D, E>(
  (A, B, C, D, E) => any
): [A, B, C, D, E];
/* eslint-enable */

export type Arguments<T> = $Call<typeof arguments, T>;

// The Dispatched version of an action creator has the same arguments but returns void
export type Dispatch<T> = (...args: Arguments<T>) => void;

// TODO: figure out how to export a map of all the dispatched actions creators
