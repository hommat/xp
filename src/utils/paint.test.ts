import {
  fillCircle,
  drawLine,
  fillRect,
  fillSpaceBeetwenPoints,
  calculateDistance,
  calculateDistancePerTick,
  fillBrushMediumCircle,
  fillBrushBigCircle,
  getAeroRowVector,
  createAeroVectorArrayFromRowsAndDists,
  reverseObjRow,
  getAeroVectorsFromPositiveAndZeroRowsAndDists
} from "./paint";

let mockBeginPathFn: jest.Mock;
let mockArcFn: jest.Mock;
let mockFillFn: jest.Mock;
let mockMoveToFn: jest.Mock;
let mockLineToFn: jest.Mock;
let mockStrokeFn: jest.Mock;
let mockFillRectFn: jest.Mock;

const createCanvasContext = () => {
  mockBeginPathFn = jest.fn();
  mockArcFn = jest.fn();
  mockFillFn = jest.fn();
  mockMoveToFn = jest.fn();
  mockLineToFn = jest.fn();
  mockStrokeFn = jest.fn();
  mockFillRectFn = jest.fn();

  return {
    beginPath: mockBeginPathFn,
    arc: mockArcFn,
    fill: mockFillFn,
    moveTo: mockMoveToFn,
    lineTo: mockLineToFn,
    stroke: mockStrokeFn,
    fillRect: mockFillRectFn
  };
};

let canvasContext: any = createCanvasContext();

describe("Paint utils functions", () => {
  beforeEach(() => {
    canvasContext = createCanvasContext();
  });

  describe("fillCircle", () => {
    it("should call beginPath, and fill once", () => {
      fillCircle(1, 1, 1, canvasContext);

      expect(mockBeginPathFn.mock.calls.length).toBe(1);
      expect(mockFillFn.mock.calls.length).toBe(1);
    });

    it("should call arc with proper args", () => {
      const x = 10;
      const y = 20;
      const size = 10;
      fillCircle(x, y, size, canvasContext);

      expect(mockArcFn.mock.calls.length).toBe(1);
      expect(mockArcFn.mock.calls[0]).toEqual([x, y, 5, 0, 2 * Math.PI]);
    });
  });

  describe("drawLine", () => {
    it("should call begin path and stroke once", () => {
      drawLine(1, 1, 2, 2, 4, canvasContext);

      expect(mockBeginPathFn.mock.calls.length).toBe(1);
      expect(mockStrokeFn.mock.calls.length).toBe(1);
    });

    it("should call moveTo with startX and startY", () => {
      const startX = 10;
      const startY = 20;
      drawLine(startX, startY, 2, 2, 4, canvasContext);

      expect(mockMoveToFn.mock.calls.length).toBe(1);
      expect(mockMoveToFn.mock.calls[0]).toEqual([startX, startY]);
    });

    it("should call lineTo with endX and endY", () => {
      const endX = 40;
      const endY = 50;
      drawLine(1, 2, endX, endY, 4, canvasContext);

      expect(mockLineToFn.mock.calls.length).toBe(1);
      expect(mockLineToFn.mock.calls[0]).toEqual([endX, endY]);
    });
  });

  describe("fillRect", () => {
    it("should call fillRect with centered args", () => {
      const x = 10;
      const y = 10;
      const size = 10;

      fillRect(x, y, size, canvasContext);

      expect(mockFillRectFn.mock.calls.length).toBe(1);
      expect(mockFillRectFn.mock.calls[0]).toEqual([5, 5, 10, 10]);
    });
  });

  describe("fillBrushMediumCircle", () => {
    const clickX = 50;
    const clickY = 100;

    it("shold call beginPath", () => {
      fillBrushMediumCircle(clickX, clickY, canvasContext);

      expect(mockBeginPathFn.mock.calls.length).toBe(1);
    });

    it("should call moveTo", () => {
      fillBrushMediumCircle(clickX, clickY, canvasContext);

      expect(mockMoveToFn.mock.calls.length).toBe(1);
      expect(mockMoveToFn.mock.calls[0]).toEqual([50, 99]);
    });

    it("should call lineTo correctly", () => {
      fillBrushMediumCircle(clickX, clickY, canvasContext);

      expect(mockLineToFn.mock.calls.length).toBe(12);

      const { calls } = mockLineToFn.mock;
      const [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12] = calls;

      expect(c1).toEqual([52, 99]);
      expect(c2).toEqual([52, 100]);
      expect(c3).toEqual([53, 100]);
      expect(c4).toEqual([53, 102]);
      expect(c5).toEqual([52, 102]);
      expect(c6).toEqual([52, 103]);
      expect(c7).toEqual([50, 103]);
      expect(c8).toEqual([50, 102]);
      expect(c9).toEqual([49, 102]);
      expect(c10).toEqual([49, 100]);
      expect(c11).toEqual([50, 100]);
      expect(c12).toEqual([50, 99]);
    });

    it("should call fill", () => {
      fillBrushMediumCircle(clickX, clickY, canvasContext);

      expect(mockFillFn.mock.calls.length).toBe(1);
    });
  });

  describe("fillBrushBigCircle", () => {
    const clickX = 50;
    const clickY = 100;

    it("shold call beginPath", () => {
      fillBrushBigCircle(clickX, clickY, canvasContext);

      expect(mockBeginPathFn.mock.calls.length).toBe(1);
    });

    it("should call moveTo", () => {
      fillBrushBigCircle(clickX, clickY, canvasContext);

      expect(mockMoveToFn.mock.calls.length).toBe(1);
      expect(mockMoveToFn.mock.calls[0]).toEqual([49, 97]);
    });

    it("should call lineTo correctly", () => {
      fillBrushBigCircle(clickX, clickY, canvasContext);

      expect(mockLineToFn.mock.calls.length).toBe(20);

      const { calls } = mockLineToFn.mock;

      expect(calls[0]).toEqual([52, 97]);
      expect(calls[1]).toEqual([52, 98]);
      expect(calls[2]).toEqual([53, 98]);
      expect(calls[3]).toEqual([53, 99]);
      expect(calls[4]).toEqual([54, 99]);
      expect(calls[5]).toEqual([54, 102]);
      expect(calls[6]).toEqual([53, 102]);
      expect(calls[7]).toEqual([53, 103]);
      expect(calls[8]).toEqual([52, 103]);
      expect(calls[9]).toEqual([52, 104]);
      expect(calls[10]).toEqual([49, 104]);
      expect(calls[11]).toEqual([49, 103]);
      expect(calls[12]).toEqual([48, 103]);
      expect(calls[13]).toEqual([48, 102]);
      expect(calls[14]).toEqual([47, 102]);
      expect(calls[15]).toEqual([47, 99]);
      expect(calls[16]).toEqual([48, 99]);
      expect(calls[17]).toEqual([48, 98]);
      expect(calls[18]).toEqual([49, 98]);
      expect(calls[19]).toEqual([49, 97]);
    });

    it("should call fill", () => {
      fillBrushBigCircle(clickX, clickY, canvasContext);

      expect(mockFillFn.mock.calls.length).toBe(1);
    });
  });

  describe("calculateDistance", () => {
    it("should return proper distances", () => {
      const [dX1, dY1, dM1] = calculateDistance(1, 1, 10, 20);
      expect(dX1).toBe(9);
      expect(dY1).toBe(19);
      expect(dM1).toBe(19);

      const [dX2, dY2, dM2] = calculateDistance(-1, -1, -10, -15);
      expect(dX2).toBe(-9);
      expect(dY2).toBe(-14);
      expect(dM2).toBe(14);

      const [dX3, dY3, dM3] = calculateDistance(-1, -1, 10, 20);
      expect(dX3).toBe(11);
      expect(dY3).toBe(21);
      expect(dM3).toBe(21);

      const [dX4, dY4, dM4] = calculateDistance(1, 1, -20, -10);
      expect(dX4).toBe(-21);
      expect(dY4).toBe(-11);
      expect(dM4).toBe(21);
    });
  });

  describe("calculateDistancePerTick", () => {
    it("should return proper distances", () => {
      const [tickX, tickY] = calculateDistancePerTick(10, 20, 20);

      expect(tickX).toBe(0.5);
      expect(tickY).toBe(1);
    });
  });

  describe("fillSpaceBeetwenPoints", () => {
    it("should call mock three times with proper args", () => {
      const mockFillFn = jest.fn();
      const startX = -1;
      const startY = -2;
      const endX = 3;
      const endY = 2;

      fillSpaceBeetwenPoints(startX, startY, endX, endY, mockFillFn);
      expect(mockFillFn.mock.calls.length).toBe(3);

      const [call1, call2, call3] = mockFillFn.mock.calls;
      expect(call1).toEqual([0, -1]);
      expect(call2).toEqual([1, 0]);
      expect(call3).toEqual([2, 1]);
    });
  });

  describe("getAeroRowVector", () => {
    it("should retun proper value", () => {
      const result = getAeroRowVector(4, 2);

      expect(result).toEqual([
        { y: 4, x: -2 },
        { y: 4, x: -1 },
        { y: 4, x: 0 },
        { y: 4, x: 1 },
        { y: 4, x: 2 }
      ]);
    });
  });

  describe("createAeroVectorArrayFromRowsAndDists", () => {
    it("should return proper value", () => {
      const rowsAndDist = [{ row: 1, distanceX: 1 }, { row: 1, distanceX: 2 }];
      const result = createAeroVectorArrayFromRowsAndDists(rowsAndDist);

      expect(result).toEqual([
        ...getAeroRowVector(rowsAndDist[0].row, rowsAndDist[0].distanceX),
        ...getAeroRowVector(rowsAndDist[1].row, rowsAndDist[1].distanceX)
      ]);
    });
  });

  describe("reverseObjRow", () => {
    it("should work when row is positive", () => {
      const row = 10;
      const obj = { row, distanceX: 1 };

      expect(reverseObjRow(obj).row).toBe(-10);
    });

    it("should work when row is negative", () => {
      const row = -10;
      const obj = { row, distanceX: 1 };

      expect(reverseObjRow(obj).row).toBe(10);
    });
  });

  describe("getAeroVectorsFromPositiveAndZeroRowsAndDists", () => {
    it("should return proper value", () => {
      const rowsAndDists = [
        { row: 1, distanceX: 1 },
        { row: 0, distanceX: 2 },
        { row: -1, distanceX: 1 }
      ];

      const [posRows] = rowsAndDists;
      const res = getAeroVectorsFromPositiveAndZeroRowsAndDists([posRows], 2);
      expect(res).toEqual(createAeroVectorArrayFromRowsAndDists(rowsAndDists));
    });
  });
});