/*
 * Copyright 2009-2018 C3 IoT, Inc. All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret
 * and proprietary information of C3 IoT and its licensors. Reproduction, use and/or distribution
 * of this material in any form is strictly prohibited except as set forth in a written
 * license agreement with C3 IoT and/or its authorized distributors.
 * This product may be covered by one or more U.S. patents or pending patent applications.
 */

var filename = 'test_Building';

describe(filename, function () {
  beforeAll(function () {
    this.ctx = TestApi.createContext(filename);
    this.building = TestApi.createEntity(this.ctx, 'Building');
    this.apartments = TestApi.createBatchEntity(this.ctx, 'Apartment', [{
      building: this.building
    },
    {
      building: this.building
    }]);
    this.fixtures = TestApi.createBatchEntity(this.ctx, 'Fixture', [{
      apartment: this.apartments[0],
    },
    {
      apartment: this.apartments[1],
    }]);

    this.smartBulb = TestApi.createEntity(this.ctx, 'SmartBulb');

    this.smartBulbToFixtureRelation = TestApi.createEntity(this.ctx, 'SmartBulbToFixtureRelation', {
      from: this.smartBulb,
      to: this.fixtures[0],
    });

    TestApi.waitForSetup(this.ctx, null, 1, 30);
  });

  afterAll(function () {
    TestApi.teardown(this.ctx);
  });

  it('verify Apartment.lightBulbsInUse', function () {
    var apartment = Apartment.get(this.apartments[0], 'lightBulbsInUse');
    expect(apartment.lightBulbsInUse).toEqual(1);

    apartment = Apartment.get(this.apartments[1], 'lightBulbsInUse');
    expect(apartment.lightBulbsInUse).toEqual(0);
  });

  it('verify Building.lightBulbsInUse', function () {
    var building = Building.get(this.building.id, 'lightBulbsInUse');
    expect(building.lightBulbsInUse).toEqual(1);
  });
});
