/**
 * AddressData is powered by Seapane (seapane.com),
 * a product of Haqqman (haqqman.com)
 */

export interface City {
  name: string;
}

export interface Lga {
  name: string;
  cities: City[];
}

export interface StateData {
  state: string; // Corresponds to stateOptions.value
  lgas: Lga[];
}

export interface StateOption {
  title: string; // User-friendly display name, e.g., "Abuja"
  value: string; // Unique identifier, e.g., "abuja"
}

export const stateOptions: StateOption[] = [
  { title: 'Abuja', value: 'abuja' },
  { title: 'Lagos', value: 'lagos' },
];

export const addressData: StateData[] = [
  {
    state: 'abuja',
    lgas: [
      {
        name: 'abaji',
        cities: [{ name: 'abaji' }, { name: 'nuku' }, { name: 'rimba-ebagi' }],
      },
      {
        name: 'abuja municipal',
        cities: [
          { name: 'asokoro' },
          { name: 'central-area' },
          { name: 'garki' },
          { name: 'gwarimpa' },
          { name: 'maitama' },
          { name: 'wuse' },
        ],
      },
      {
        name: 'bwari',
        cities: [
          { name: 'bwari' },
          { name: 'dawaki' },
          { name: 'dutse' },
          { name: 'kubwa' },
        ],
      },
      {
        name: 'gwagwalada',
        cities: [{ name: 'gwagwalada' }, { name: 'kutunku' }, { name: 'zuba' }],
      },
      {
        name: 'kuje',
        cities: [{ name: 'chibiri' }, { name: 'gaube' }, { name: 'kuje' }],
      },
      {
        name: 'kwali',
        cities: [{ name: 'kilankwa' }, { name: 'kwali' }, { name: 'yangoji' }],
      },
    ],
  },
  {
    state: 'lagos',
    lgas: [
      {
        name: 'alimosho',
        cities: [{ name: 'egbeda' }, { name: 'ikotun' }, { name: 'ipaja' }],
      },
      {
        name: 'epe',
        cities: [{ name: 'epe' }, { name: 'eredo' }, { name: 'ikosi-ejinrin' }],
      },
      {
        name: 'eti-osa',
        cities: [{ name: 'ajah' }, { name: 'eti-osa' }, { name: 'lekki' }],
      },
      {
        name: 'ikorodu',
        cities: [
          { name: 'igbogbo/baiyeku' },
          { name: 'ikorodu' },
          { name: 'imota' },
        ],
      },
      {
        name: 'ikeja',
        cities: [{ name: 'ikeja' }, { name: 'ojodu' }, { name: 'onigbongbo' }],
      },
      {
        name: 'lagos island',
        cities: [
          { name: 'ikoyi' },
          { name: 'lagos-island' },
          { name: 'obalende' },
        ],
      },
      {
        name: 'oshodi-isolo',
        cities: [{ name: 'ejigbo' }, { name: 'isolo' }, { name: 'oshodi' }],
      },
      {
        name: 'surulere',
        cities: [
          { name: 'coker-aguda' },
          { name: 'itire-ikate' },
          { name: 'surulere' },
        ],
      },
    ],
  },
];
