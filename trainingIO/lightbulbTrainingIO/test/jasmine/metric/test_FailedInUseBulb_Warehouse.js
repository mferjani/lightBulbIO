/*
 * Copyright 2009-2018 C3 IoT, Inc. All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret
 * and proprietary information of C3 IoT and its licensors. Reproduction, use and/or distribution
 * of this material in any form is strictly prohibited except as set forth in a written
 * license agreement with C3 IoT and/or its authorized distributors.
 * This product may be covered by one or more U.S. patents or pending patent applications.
 */

var filename = 'test_FailedInUseBulb_Warehouse';

describe(filename, function () {
  beforeAll(function () {
    this.ctx = TestApi.createContext(filename);

    this.warehouse = TestApi.createEntity(this.ctx, "Warehouse");

    this.building = TestApi.createEntity(this.ctx, 'Building', {
      warehouse: this.warehouse,
    });
    this.apartments = TestApi.createBatchEntity(this.ctx, 'Apartment', [{
      building: this.building,
    },
    {
      building: this.building,
    }]);

    this.fixtures = TestApi.createBatchEntity(this.ctx, 'Fixture', [{
      apartment: this.apartments[0],
    },
    {
      apartment: this.apartments[0],
    },
    {
      apartment: this.apartments[1],
    },
    {
      apartment: this.apartments[1],
    }]);

    this.smartBulbs = TestApi.createBatchEntity(this.ctx, "SmartBulb", [{}, {}, {}, {}, {}, {}]);

    this.smartBulbMeasurementSerieses = TestApi.createBatchEntity(this.ctx, 'SmartBulbMeasurementSeries', [{
      smartBulb: this.smartBulbs[0],
    },
    {
      smartBulb: this.smartBulbs[1],
    },
    {
      smartBulb: this.smartBulbs[2],
    },
    {
      smartBulb: this.smartBulbs[3],
    },
    {
      smartBulb: this.smartBulbs[4],
    },
    {
      smartBulb: this.smartBulbs[5],
    }]);

    this.smartBulbMeasurement = TestApi.createBatchEntity(this.ctx, 'SmartBulbMeasurement', [{
      parent: this.smartBulbMeasurementSerieses[0],
      start: '2018-01-01',
      end: '2018-01-03',
      lumens: 2,
    },
    {
      parent: this.smartBulbMeasurementSerieses[0],
      start: '2018-01-03',
      end: '2018-01-05',
      lumens: 0,
    },
    {
      parent: this.smartBulbMeasurementSerieses[1],
      start: '2018-01-03',
      end: '2018-01-04',
      lumens: 1,
    },
    {
      parent: this.smartBulbMeasurementSerieses[1],
      start: '2018-01-04',
      end: '2018-01-06',
      lumens: 0,
    },
    {
      parent: this.smartBulbMeasurementSerieses[2],
      start: '2018-01-01',
      end: '2018-01-03',
      lumens: 1,
    },
    {
      parent: this.smartBulbMeasurementSerieses[2],
      start: '2018-01-03',
      end: '2018-01-05',
      lumens: 0,
    },
    {
      parent: this.smartBulbMeasurementSerieses[3],
      start: '2018-01-04',
      end: '2018-01-05',
      lumens: 1,
    },
    {
      parent: this.smartBulbMeasurementSerieses[4],
      start: '2018-01-01',
      end: '2018-01-05',
      lumens: 1,
    },
    {
      parent: this.smartBulbMeasurementSerieses[5],
      start: '2018-01-01',
      end: '2018-01-04',
      lumens: 1,
    },
    {
      parent: this.smartBulbMeasurementSerieses[5],
      start: '2018-01-04',
      end: '2018-01-05',
      lumens: 0,
    }]);

    TestApi.createBatchEntity(this.ctx, 'SmartBulbToFixtureRelation', [{
      from: this.smartBulbs[0],
      to: this.fixtures[0],
      start: '2018-01-01',
      end: '2018-01-03',
    },
    {
      from: this.smartBulbs[1],
      to: this.fixtures[0],
      start: '2018-01-03',
      end: '2018-01-05',      //Fail from 1/4-1/6
    },
    {
      from: this.smartBulbs[2],
      to: this.fixtures[1],
      start: '2018-01-01',
      end: '2018-01-04',      //Fail from 1/3-1/5
    },
    {
      from: this.smartBulbs[3],
      to: this.fixtures[1],
      start: '2018-01-04',
      end: '2018-01-05',
    },
    {
      from: this.smartBulbs[4],
      to: this.fixtures[2],
      start: '2018-01-01',
      end: '2018-01-04',
    },
    {
      from: this.smartBulbs[0],
      to: this.fixtures[2],
      start: '2018-01-04',
      end: '2018-01-05',      //Fail the whole time
    },
    {
      from: this.smartBulbs[5],
      to: this.fixtures[3],
      start: '2018-01-01',
      end: '2018-01-05',      //Fail from 1/4-1/5
    }]);

    TestApi.waitForSetup(this.ctx, null, 1, 30);
  });

  afterAll(function () {
    TestApi.teardown(this.ctx);
  });

  it('verify FailedInUseBulb_Warehouse in day interval', function () {
    var result = Warehouse.evalMetric({
      id: this.warehouse.id,
      expression: 'FailedInUseBulb',
      start: '2018-01-01',
      end: '2018-01-05',
      interval: 'DAY',
    });

    expect(result.data()).toEqual([0, 0, 1, 3]);
  });
});
