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

import { HttpError } from './http-error';

/**
 * An error thrown when the media type of incoming data is not supported by a parser.
 */
export class UnsupportedMediaTypeHttpError extends HttpError {

  constructor(message?: string) {

    super(415, 'UnsupportedMediaTypeHttpError', message);

  }

  static isInstance(error: unknown): error is UnsupportedMediaTypeHttpError {

    const errorIsInstance = HttpError.isInstance(error) && error.statusCode === 415;

    this.logger.info(`Checking if ${error} is an instance of ${this.name}: `, errorIsInstance);

    return errorIsInstance;

  }

}
