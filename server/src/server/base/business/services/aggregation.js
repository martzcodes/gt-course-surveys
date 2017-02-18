'use strict';

import _ from 'lodash';
import stats from 'stats-lite';
import db from '../database';
import Aggregation from '../../data/models/aggregation';
import Cache from '../cache';
import FirebaseEnum from '../../enums/firebase';
import Logger from '../../logger';
import Review from '../../data/models/review';
import ReviewService from './review';
import Util from '../util';

const { Event } = FirebaseEnum;

const cache = {
  rvw: Cache.get('RVW'),
  crs: Cache.get('CRS')
};

function _remove(courseId) {
  return db.ref('AGG').child(courseId).remove();
}

async function _update(courseId) {
  const reviews = _.filter(cache.rvw.all(), ['course', courseId]);
  const count = reviews.length;
  Logger.info(`base.business.services.aggregation: ${courseId} (${count})`);
  if (count > 0) {
    try {
      await Aggregation.builder()
        .setId(courseId)
        .setCount(count)
        .setDifficulty(stats.mean(_.map(reviews, 'difficulty')))
        .setWorkload(stats.mean(_.map(reviews, 'workload')))
        .setRating(stats.mean(_.map(reviews, 'rating')))
        .setHash(ReviewService.hash(reviews))
        .save();
    } catch (error) {
      Logger.error('base.business.services.aggregation:', error);
    }
  } else {
    await _remove(courseId);
  }
}

function _onReviewChanged(review) {
  _update(review.course);
}

async function init() {
  await Promise.all(_.chain(cache.crs.all()).keys().map(_update).value());

  db.ref('RVW').on(Event.ChildCreated, Util.on(_onReviewChanged, Review));
  db.ref('RVW').on(Event.ChildUpdated, Util.on(_onReviewChanged, Review));
  db.ref('RVW').on(Event.ChildRemoved, Util.on(_onReviewChanged, Review));
}

export default {
  init
};
