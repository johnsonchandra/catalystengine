import unfreezeApolloCacheValue from './unfreezeApolloCacheValue';
import { documents } from '../../../tests/fixtures/documents';

describe('unfreezeApolloCacheValue.js', () => {
  test('it unfreezes a frozen JavaScript Object', () => {
    const frozenObject = Object.freeze({
      ...documents[0],
      __typename: 'Document',
    });

    const unfrozenCacheValue = unfreezeApolloCacheValue(frozenObject);

    expect(unfrozenCacheValue).toEqual({
      _id: 'document123',
      name: 'Document Title #1',
      createdAt: '2018-11-05T20:34:54.225Z',
      updatedAt: '2018-11-05T20:34:54.225Z',
    });
  });

  test('it removes __typename field from objects', () => {
    const frozenObject = Object.freeze({
      ...documents[0],
      __typename: 'Document',
    });

    const unfrozenCacheValue = unfreezeApolloCacheValue(frozenObject);

    expect(unfrozenCacheValue.__typename).toBe(undefined); //eslint-disable-line
  });
});
