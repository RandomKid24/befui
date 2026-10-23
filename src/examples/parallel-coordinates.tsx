import { ParallelCoordinates } from '@/components/ui/parallel-coordinates';

const cars = [
  ['Sedan A', 28, 210, 6.1, 14.2, 0], ['Sedan B', 31, 190, 7.4, 13.1, 0], ['Hatch C', 38, 160, 9.8, 11.4, 0], ['Hatch D', 36, 170, 9.1, 11.9, 0],
  ['SUV E', 22, 230, 8.2, 21.5, 1], ['SUV F', 24, 215, 8.9, 19.8, 1], ['SUV G', 20, 250, 7.1, 26.0, 1],
  ['EV H', 0, 260, 4.6, 38.0, 2], ['EV I', 0, 220, 6.2, 31.5, 2], ['EV J', 0, 190, 7.8, 24.9, 2],
] as const;

export default function ParallelCoordinatesDemo() {
  return (
    <ParallelCoordinates
      className="w-[42rem] max-w-full"
      axes={[
        { key: 'mpg', label: 'Mileage', format: (n) => `${n} km/l` },
        { key: 'top', label: 'Top speed', format: (n) => `${n} km/h` },
        { key: 'acc', label: '0-100 s', format: (n) => `${n}s` },
        { key: 'price', label: 'Price', format: (n) => `₹${n}L` },
      ]}
      groups={[{ name: 'Petrol' }, { name: 'Diesel SUV' }, { name: 'Electric' }]}
      rows={cars.map(([name, mpg, top, acc, price, group]) => ({ name, group, values: { mpg, top, acc, price } }))}
    />
  );
}
