export const createPixelFlexConverter = (
  totalCurrentValue: number,
  totalDestinationValue: number
) => (currentValue: number) =>
  (currentValue / totalCurrentValue) * totalDestinationValue;
