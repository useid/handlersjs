/**
 * MIT License
 *
 * Copyright (c) 2020 Solid Community
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { types } from 'util';
import { getLogger } from '@useid/handlersjs-logging';

/**
 * A class for all errors that could be thrown by Solid.
 * All errors inheriting from this should fix the status code thereby hiding the HTTP internals from other components.
 */
export class HttpError extends Error {

  protected static readonly statusCode: number;
  public readonly statusCode: number;
  protected static readonly logger = getLogger();

  /**
   * Creates a new HTTP error. Subclasses should call this with their fixed status code.
   *
   * @param statusCode - HTTP status code needed for the HTTP response.
   * @param name - Error name. Useful for logging and stack tracing.
   * @param message - Message to be thrown.
   */
  constructor(statusCode: number, name: string, message?: string) {

    super(message);
    this.statusCode = statusCode;
    this.name = name;

  }

  static isInstance(error: unknown): error is HttpError {

    this.logger.info(`Checking if ${error} is an instance of ${this.name}`);

    return types.isNativeError(error) && Object.entries(error).find(([ key, val ]) => key === 'statusCode' && typeof val === 'number') !== undefined;

  }

}
