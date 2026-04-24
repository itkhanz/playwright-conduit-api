import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './logger';

let apiLogger: APILogger

export const setCustomExpectLogger = (logger: APILogger) => {
    this.apiLogger = logger
}

export const expect = baseExpect.extend({

});