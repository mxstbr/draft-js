/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails isaac, oncall+ui_infra
 */

'use strict';

jest.autoMockOff();

var DraftEntity = require('DraftEntity');

describe('DraftEntity', () => {
  beforeEach(() => {
    jest.resetModuleRegistry();
  });

  function createLink() {
    return DraftEntity.create('LINK', 'MUTABLE', {uri: 'zombo.com'});
  }

  it('must create instances', () => {
    var key = createLink();
    expect(typeof key).toBe('string');
  });

  it('must retrieve an instance given a key', () => {
    var key = createLink();
    var retrieved = DraftEntity.get(key);
    expect(retrieved.getType()).toBe('LINK');
    expect(retrieved.getMutability()).toBe('MUTABLE');
    expect(retrieved.getData()).toEqual({uri: 'zombo.com'});
  });

  it('must throw when retrieving for an invalid key', () => {
    createLink();
    expect(() => DraftEntity.get('asdfzxcvqweriuop')).toThrow();
    expect(() => DraftEntity.get(null)).toThrow();
  });

  it('must merge data', () => {
    var key = createLink();

    // Merge new property.
    var newData = {foo: 'bar'};
    DraftEntity.mergeData(key, newData);
    var newEntity = DraftEntity.get(key);
    expect(newEntity.getData()).toEqual({
      uri: 'zombo.com',
      foo: 'bar',
    });

    // Replace existing property.
    var withNewURI = {uri: 'homestarrunner.com'};
    DraftEntity.mergeData(key, withNewURI);
    var entityWithNewURI = DraftEntity.get(key);
    expect(entityWithNewURI.getData()).toEqual({
      uri: 'homestarrunner.com',
      foo: 'bar',
    });
  });
});
