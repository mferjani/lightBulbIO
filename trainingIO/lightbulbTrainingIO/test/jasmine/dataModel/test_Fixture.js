/*
 * Copyright 2009-2018 C3 IoT, Inc. All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret
 * and proprietary information of C3 IoT and its licensors. Reproduction, use and/or distribution
 * of this material in any form is strictly prohibited except as set forth in a written
 * license agreement with C3 IoT and/or its authorized distributors.
 * This product may be covered by one or more U.S. patents or pending patent applications.
 */

var filename = 'test_Fixture';

describe(filename, function () {
  beforeAll(function () {
    this.ctx = TestApi.createContext(filename);
    this.fixtures = TestApi.createBatchEntity(this.ctx, 'Fixture', [{}, {}]);
    this.smartBulbs = TestApi.createBatchEntity(this.ctx, 'SmartBulb', [{}, {}, {}]);
    this.smartBulbToFixtureRelations = TestApi.createBatchEntity(this.ctx, 'SmartBulbToFixtureRelation', [{
      from: this.smartBulbs[0],
      to: this.fixtures[0],
      start: '2018-01-01',
      end: '2018-02-01',
    },
    {
      from: this.smartBulbs[1],
      to: this.fixtures[0],
      start: '2018-05-01',
    },
    {
      from: this.smartBulbs[2],
      to: this.fixtures[1],
      start: '2018-06-01',
      end: '2018-07-01',
    },
    {
      from: this.smartBulbs[0],
      to: this.fixtures[1],
      start: '2018-04-01',
      end: '2018-05-01',
    }]);

    TestApi.waitForSetup(this.ctx, null, 1, 30);
  });

  afterAll(function () {
    TestApi.teardown(this.ctx);
  });

  it('verify Fixture.currentBulb', function () {
    var fixture = Fixture.get(this.fixtures[0], 'currentBulb.id');
    expect(fixture.currentBulb.id).toEqual(this.smartBulbs[1]);
    fixture = Fixture.get(this.fixtures[1], 'currentBulb');
    expect(fixture.currentBulb).toBeUndefined();
  });
});
