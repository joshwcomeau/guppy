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

type Actions = $ObjMap<typeof actions, typeof returnType>;

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
declare function argumentsAndVoid(() => any): (...args: []) => void;
declare function argumentsAndVoid<A>((A) => any): (...args: [A]) => void;
declare function argumentsAndVoid<A, B>(
  (A, B) => any
): (...args: [A, B]) => void;
declare function argumentsAndVoid<A, B, C>(
  (A, B, C) => any
): (...args: [A, B, C]) => void;
declare function argumentsAndVoid<A, B, C, D>(
  (A, B, C, D) => any
): (...args: [A, B, C, D]) => void;
declare function argumentsAndVoid<A, B, C, D, E>(
  (A, B, C, D, E) => any
): (...args: [A, B, C, D, E]) => void;
/* eslint-enable */

export type Arguments<T> = $Call<typeof arguments, T>;

// The Dispatched version of an action creator has the same arguments but returns void
export type Dispatch<T> = (...args: Arguments<T>) => void;

// TODO: it'd be nice to be able to do `ActionsCreators.addDependency` instead
// of `Dispatch<typeof actions.addDependency> but that's not possible yet because
// see https://github.com/facebook/flow/issues/2865
// Same for Actions
// export type ActionCreators = $ObjMap<typeof actions, typeof argumentsAndVoid>;
