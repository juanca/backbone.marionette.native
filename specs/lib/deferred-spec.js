Deferred = require('../../lib/$.js').Deferred;

describe('Backbone.Native Deferred', function(){
  "use strict";

  var deferred, spyOne, spyTwo, spyThree;

  function itRunsAlways() {
    describe('itRunsAlways', function() {
      beforeEach(function() {
        deferred = Deferred();
        deferred.always(spyOne).done(spyTwo).fail(spyThree);
      });

      describe('resolving', function() {
        beforeEach(function() {
          deferred.resolve(1, 2, 3);
        });

        it('runs always and done callbacks', function() {
          expect(spyOne).toHaveBeenCalled();
          expect(spyTwo).toHaveBeenCalled();
          expect(spyThree).not.toHaveBeenCalled();
        });

        it('applies parameters on always and done callbacks', function() {
          expect(spyOne).toHaveBeenCalledWith(1, 2, 3);
          expect(spyTwo).toHaveBeenCalledWith(1, 2, 3);
        });
      });

      describe('rejecting', function() {
        beforeEach(function() {
          deferred.reject(1, 2, 3);
        });

        it('runs always and fail callbacks', function() {
          expect(spyOne).toHaveBeenCalled();
          expect(spyTwo).not.toHaveBeenCalled();
          expect(spyThree).toHaveBeenCalled();
        });

        it('applies parameters on always fail callbacks', function() {
          expect(spyOne).toHaveBeenCalledWith(1, 2, 3);
          expect(spyThree).toHaveBeenCalledWith(1, 2, 3);
        });
      });
    });
  }

  function itRunsDoneOnResolve() {
    describe('itRunsDoneOnResolve', function() {
      beforeEach(function() {
        deferred = Deferred();
        deferred.done(spyOne).done(spyTwo).fail(spyThree);

        deferred.resolve(1, 2, 3);
      });

      it('runs done callbacks on resolve', function() {
        expect(spyOne).toHaveBeenCalled();
        expect(spyTwo).toHaveBeenCalled();
        expect(spyThree).not.toHaveBeenCalled();
      });

      it('applies parameters on done callbacks', function() {
        expect(spyOne).toHaveBeenCalledWith(1, 2, 3);
        expect(spyTwo).toHaveBeenCalledWith(1, 2, 3);
      });
    });
  }

  function itRunsFailOnReject() {
    describe('itRunsFailOnReject', function() {
      beforeEach(function() {
        deferred = Deferred();
        deferred.fail(spyOne).fail(spyTwo).done(spyThree);

        deferred.reject(1, 2, 3);
      });

      it('runs fail callbacks on reject', function() {
        expect(spyOne).toHaveBeenCalled();
        expect(spyTwo).toHaveBeenCalled();
        expect(spyThree).not.toHaveBeenCalled();
      });

      it('applies parameters on fail callbacks', function() {
        expect(spyOne).toHaveBeenCalledWith(1, 2, 3);
        expect(spyTwo).toHaveBeenCalledWith(1, 2, 3);
      });
    });
  }

  beforeEach(function(){
    spyOne = jasmine.createSpy('spyOne');
    spyTwo = jasmine.createSpy('spyTwo');
    spyThree = jasmine.createSpy('spyThree');
  });

  afterEach(function(){
    spyOne = null;
    spyTwo = null;
    spyThree = null;
    deferred = null;
  });

  describe('promise api', function() {
    describe('always', function() {
      itRunsAlways();
      itRunsDoneOnResolve();
      itRunsFailOnReject();

      describe('multiple promises', function() {
        beforeEach(function() {
          var deferred1 = Deferred();
          deferred1.always(spyOne);

          var deferred2 = Deferred();
          deferred2.always(spyTwo);

          deferred1.resolve(1, 2, 3);
        });

        it('isolates internal state', function() {
          expect(spyOne).toHaveBeenCalled();
          expect(spyTwo).not.toHaveBeenCalled();
        });
      });
    });

    describe('done', function() {
      itRunsDoneOnResolve();

      describe('multiple promises', function() {
        beforeEach(function() {
          var deferred1 = Deferred();
          deferred1.done(spyOne);

          var deferred2 = Deferred();
          deferred2.done(spyTwo);

          deferred1.resolve(1, 2, 3);
        });

        it('isolates internal state', function() {
          expect(spyOne).toHaveBeenCalled();
          expect(spyTwo).not.toHaveBeenCalled();
        });
      });
    });

    describe('fail', function() {
      itRunsFailOnReject();

      describe('multiple promises', function() {
        beforeEach(function() {
          var deferred1 = Deferred();
          deferred1.fail(spyOne);

          var deferred2 = Deferred();
          deferred2.fail(spyTwo);

          deferred1.reject(1, 2, 3);
        });

        it('isolates internal state', function() {
          expect(spyOne).toHaveBeenCalled();
          expect(spyTwo).not.toHaveBeenCalled();
        });
      });
    });
  });
});
