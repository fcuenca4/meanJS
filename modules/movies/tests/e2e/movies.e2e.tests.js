'use strict';

describe('Movies E2E Tests:', function () {
  describe('Test Movies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/movies');
      expect(element.all(by.repeater('movie in movies')).count()).toEqual(0);
    });
  });
});
