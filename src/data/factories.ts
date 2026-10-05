import { faker } from '@faker-js/faker';

export type CustomerInfo = { firstName: string; lastName: string; postalCode: string };

/** Generates unique checkout data per test so tests never share state. */
export function buildCustomer(overrides: Partial<CustomerInfo> = {}): CustomerInfo {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
    ...overrides,
  };
}
