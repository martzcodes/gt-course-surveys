'use strict';

import _ from 'lodash';
import stats from 'stats-lite';
import db, { archive } from '../database';
import Aggregation from '../../data/models/aggregation';
import FirebaseEnum from '../../enum/firebase';
import Logger from '../../logger';
import Course from '../../data/models/course';
import Review from '../../data/models/review';
import ReviewService from './review';
import Util from '../util';

const { ChildCreated, ChildUpdated, ChildRemoved } = FirebaseEnum.Event;

const cache = {
  rvw: {},
  crs: {}
};

function _remove(courseId) {
  return db.ref('AGG').child(courseId).remove();
}

async function _update(courseId) {
  const reviews = _.filter(cache.rvw, ['course', courseId]);
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
  cache.rvw[review._id] = review;

  _update(review.course);
}

function _onReviewRemoved(review) {
  delete cache.rvw[review._id];

  _update(review.course);
}

class Service {
  static async init() {
    const [
      courses,
      reviewsNew,
      reviewsOld
    ] = await Promise.all([
      db.get('CRS'),
      db.get('RVW'),
      archive.get('RVW')
    ]);

    cache.crs = Util.zip(Util.many({ model: Course, snapshot: courses }));
    cache.rvw = _.merge(
      Util.zip(Util.many({ model: Review, snapshot: reviewsNew })),
      Util.zip(Util.many({ model: Review, snapshot: reviewsOld }))
    );

    await Promise.all(_.keys(cache.crs).map(_update));

    db.ref('RVW').on(ChildCreated, Util.on(_onReviewChanged, Review));
    db.ref('RVW').on(ChildUpdated, Util.on(_onReviewChanged, Review));
    db.ref('RVW').on(ChildRemoved, Util.on(_onReviewRemoved, Review));

    archive.ref('RVW').on(ChildCreated, Util.on(_onReviewChanged, Review));
    archive.ref('RVW').on(ChildUpdated, Util.on(_onReviewChanged, Review));
    archive.ref('RVW').on(ChildRemoved, Util.on(_onReviewRemoved, Review));
  }
}

export default Service;
