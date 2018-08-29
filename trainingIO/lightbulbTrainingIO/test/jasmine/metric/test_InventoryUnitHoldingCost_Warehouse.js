/*
 * Copyright 2009-2018 C3 IoT, Inc. All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret
 * and proprietary information of C3 IoT and its licensors. Reproduction, use and/or distribution
 * of this material in any form is strictly prohibited except as set forth in a written
 * license agreement with C3 IoT and/or its authorized distributors.
 * This product may be covered by one or more U.S. patents or pending patent applications.
 */

var filename = 'test_InventoryUnitHoldingCost_Warehouse';

describe(filename, function () {
  beforeAll(function () {
    var now = DateTime.now();
    this.ctx = TestApi.createContext(filename);

    this.warehouse = TestApi.createEntity(this.ctx, 'Warehouse', {
      holdingCostPerBulbPerDay: 1,
    });
  });

  afterAll(function () {
    TestApi.teardown(this.ctx);
  });

  it('verify InventoryUnitHoldingCost_Warehouse in day interval', function () {
    var result = Warehouse.evalMetric({
      id: this.warehouse.id,
      expression: 'InventoryUnitHoldingCost',
      start: '2018-01-01',
      end: '2018-01-05',
      interval: 'DAY',
    });

    expect(result.data()).toEqual([1, 1, 1, 1]);
  });

  it('verify InventoryUnitHoldingCost_Warehouse in month interval', function () {
    var result = Warehouse.evalMetric({
      id: this.warehouse.id,
      expression: 'InventoryUnitHoldingCost',
      start: '2018-01-01',
      end: '2018-05-01',
      interval: 'MONTH',
    });

    expect(result.data()).toEqual([31, 28, 31, 30]);
  });
});
