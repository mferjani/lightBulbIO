/*
 * Copyright 2009-2018 C3 IoT, Inc. All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret
 * and proprietary information of C3 IoT and its licensors. Reproduction, use and/or distribution
 * of this material in any form is strictly prohibited except as set forth in a written
 * license agreement with C3 IoT and/or its authorized distributors.
 * This product may be covered by one or more U.S. patents or pending patent applications.
 */

var filename = 'test_WarehouseMovementSeries';

describe(filename, function () {
  beforeAll(function () {
    this.ctx = TestApi.createContext(filename);

    this.warehouseMovementSeries = TestApi.createEntity(this.ctx, 'WarehouseMovementSeries');

    TestApi.createBatchEntity(this.ctx, 'WarehouseMovement', [{
      parent: this.warehouseMovementSeries,
      quantity: 10,
      start: '2018-01-02',
    },
    {
      parent: this.warehouseMovementSeries,
      quantity: -5,
      start: '2018-01-03',
    },
    {
      parent: this.warehouseMovementSeries,
      quantity: 20,
      start: '2018-01-04',
    },
    {
      parent: this.warehouseMovementSeries,
      quantity: 5,
      start: '2018-01-05',
    }]);

    TestApi.waitForSetup(this.ctx, null, 1, 30);
  });

  afterAll(function () {
    TestApi.teardown(this.ctx);
  });

  it('verify WarehouseMovementSeries.currentInventory', function () {
    var warehouseMovementSeries = WarehouseMovementSeries.get(this.warehouseMovementSeries.id, 'currentInventory');
    expect(warehouseMovementSeries.currentInventory).toEqual(30);
  });
});
