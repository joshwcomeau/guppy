const isFirstHalf = (index, totalNum) => {
  return index <= totalNum / 2;
};
export const getCloudPathFromPoints = (points: Array<number>) => {
  const [firstPoint, ...otherPoints] = points;

  const initialPosition = `M${firstPoint},0`;

  return otherPoints.reduce((acc, point, index) => {
    const numOfPoints = otherPoints.length;

    const isEven = index % 2 === 0;

    const rowNum = isFirstHalf(index, numOfPoints)
      ? index
      : numOfPoints - index;
    const nextRowNum = isFirstHalf(index + 1, numOfPoints)
      ? rowNum + 1
      : rowNum - 1;

    const largeArcFlag = isFirstHalf(index + 1, numOfPoints)
      ? isEven
        ? 1
        : 0
      : isEven
        ? 0
        : 1;

    const lineInstruction = `L${point},${rowNum}`;

    const arcInstruction = `
        A 0.5 0.5 0 0 ${largeArcFlag} ${point} ${nextRowNum}
      `;

    return `${acc} ${lineInstruction} ${arcInstruction}`;
  }, initialPosition);
};
