'use strict';

import _ from 'lodash';
import assert from 'assert';
import db from './database';
import FirebaseEnum from '../enums/firebase';
import Util from './util';

const { Event } = FirebaseEnum;

class Cache {
  static get(ini) {
    return _.get(Cache._map, ini, null);
  }

  static async make(model) {
    assert(model);

    const cache = new Cache();
    const snapshot = await db.get(model.INI);
    const entities = await Util.many({ model, snapshot });
    cache.set(_.zipObject(_.map(entities, '_id'), entities));
    Cache._map[model.INI] = cache;

    db.ref(model.INI).on(Event.ChildCreated, Util.on(Cache._onCreated, model));
    db.ref(model.INI).on(Event.ChildUpdated, Util.on(Cache._onUpdated, model));
    db.ref(model.INI).on(Event.ChildRemoved, Util.on(Cache._onRemoved, model));
  }

  static _onCreated(entity, model) {
    Cache._map[model.INI].put(entity._id, entity);
  }

  static _onUpdated(entity, model) {
    Cache._map[model.INI].put(entity._id, entity);
  }

  static _onRemoved(entity, model) {
    Cache._map[model.INI].del(entity._id);
  }

  constructor() {
    this.store = {};
  }

  set(data) {
    this.store = data;
    return this;
  }

  put(key, value) {
    assert(key);
    _.set(this.store, key, value);
    return this;
  }

  get(key) {
    assert(key);
    return _.get(this.store, key);
  }

  del(key) {
    assert(key);
    _.unset(this.store, key);
    return this;
  }

  has(key) {
    assert(key);
    return _.has(this.store, key);
  }

  all() {
    return this.store;
  }
}

Cache._map = {};

export default Cache;
