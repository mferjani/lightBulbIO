/*
 * Copyright 2009-2018 C3 IoT, Inc. All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret
 * and proprietary information of C3 IoT and its licensors. Reproduction, use and/or distribution
 * of this material in any form is strictly prohibited except as set forth in a written
 * license agreement with C3 IoT and/or its authorized distributors.
 * This product may be covered by one or more U.S. patents or pending patent applications.
 */

var filename = 'test_FirstWarehouseMovementDate_Warehouse';

describe(filename, function () {
  beforeAll(function () {
    var now = DateTime.now();
    this.ctx = TestApi.createContext(filename);

    this.warehouse = TestApi.createEntity(this.ctx, 'Warehouse', {
      holdingCostPerBulbPerDay: 5,
    });

    this.warehouseMovementSerieses = TestApi.createBatchEntity(this.ctx, 'WarehouseMovementSeries', [{
      warehouse: this.warehouse,
      movementCategory: WarehouseMovementCategory.DEPARTURE,
    },
    {
      warehouse: this.warehouse,
      movementCategory: WarehouseMovementCategory.ARRIVAL,
    }]);

    this.earliestTimestamp = new DateTime('2018-01-02');

    TestApi.createBatchEntity(this.ctx, 'WarehouseMovement', [{
      parent: this.warehouseMovementSerieses[1],
      quantity: 10,
      start: this.earliestTimestamp,
    },
    {
      parent: this.warehouseMovementSerieses[0],
      quantity: -5,
      start: '2018-01-03',
    },
    {
      parent: this.warehouseMovementSerieses[1],
      quantity: 20,
      start: '2018-01-04',
    },
    {
      parent: this.warehouseMovementSerieses[1],
      quantity: 5,
      start: '2018-01-05',
    }]);

    TestApi.waitForSetup(this.ctx, null, 1, 30);
  });

  afterAll(function () {
    TestApi.teardown(this.ctx);
  });

  it('verify FirstWarehouseMovementDate_Warehouse', function () {
    var result = Warehouse.evalMetric({
      id: this.warehouse.id,
      expression: 'FirstWarehouseMovementDate',
      start: '2018-01-01',
      end: '2018-05-01',
      interval: 'MONTH',
    });

    var millis = this.earliestTimestamp.getMillis();

    expect(result.data()).toEqual([millis, millis, millis, millis]);
  });
});
