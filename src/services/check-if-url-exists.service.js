// @flow
import fetch from 'node-fetch';

export const urlExists = (url: string) =>
  new Promise<boolean>(async resolve => {
    const response = await fetch(url);
    resolve(response.ok);
  });
