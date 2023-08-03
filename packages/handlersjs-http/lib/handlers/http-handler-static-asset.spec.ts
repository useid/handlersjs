import { join } from 'path';
import { lastValueFrom } from 'rxjs';
import { HttpHandlerContext } from '../models/http-handler-context';
import { NotFoundHttpError } from '../errors/not-found-http-error';
import { ForbiddenHttpError } from '../errors/forbidden-http-error';
import { UnsupportedMediaTypeHttpError } from '../errors/unsupported-media-type-http-error';
import { HttpHandlerStaticAssetService } from './http-handler-static-asset';

jest.mock('fs/promises', () => ({
  readFile: jest.fn().mockImplementation(async (path) => {

    if (path.toString().includes('test.txt')) { return 'test file'; } else { throw new NotFoundHttpError('Error while trying to read file'); }

  }),
}));

describe('HttpHandlerStaticAssetService', () => {

  const service: HttpHandlerStaticAssetService = new HttpHandlerStaticAssetService('test/', 'text/plain');

  let context: HttpHandlerContext;

  beforeEach(() => {

    context = {
      request: {
        url: new URL('http://example.com'),
        method: 'GET',
        headers: {
          accept: 'text/plain',
        },
        parameters: {
          filename: 'filler.file',
        },
      },
    };

  });

  it('should be correctly instantiated', () => {

    expect(service).toBeTruthy();

  });

  describe('handle()', () => {

    it('should set Content-Type when Accept is undefined', async() => {

      const contentType = 'text/plain';
      const absolutePath = join(__dirname, '../../test/');
      const absoluteService = new HttpHandlerStaticAssetService(absolutePath, contentType);

      context.request.parameters = { filename: 'test.txt' };

      const response = await lastValueFrom(absoluteService.handle(
        { ... context, request: { ... context.request, headers: { accept: (undefined as unknown as string) } } },
      ));

      await expect(response.headers).toStrictEqual({ 'Content-Type': `${contentType}` });

    });

    it('throws an UnsupportedMediaTypeHttpError when content-type is not supported', async() => {

      const response = lastValueFrom(service.handle({ ... context, request: { ... context.request, headers: { accept: 'application/json' } } }));

      await expect(response).rejects.toThrow(new UnsupportedMediaTypeHttpError('Content type not supported'));

    });

    it('throws a ForbiddenHttpError when filename is invalid', async() => {

      context.request.parameters = { filename: '../../test.txt' };
      const response = lastValueFrom(service.handle(context));

      await expect(response).rejects.toThrow(new ForbiddenHttpError(''));

    });

    it('throws a NotFoundHttpError when file is not found', async() => {

      context.request.parameters = { filename: 'test.php' };
      const response = lastValueFrom(service.handle(context));

      await expect(response).rejects.toThrow(new NotFoundHttpError('Error while trying to read file'));

    });

    it('throws a NotFoundHttpError when file is not provided', async() => {

      context.request.parameters = { filename: (undefined as unknown as string) };
      const response = lastValueFrom(service.handle(context));

      await expect(response).rejects.toThrow(new NotFoundHttpError('Error while trying to read file'));

    });

    it('should return file content when file is found', async() => {

      context.request.parameters = { filename: 'test.txt' };
      const response = await lastValueFrom(service.handle(context));

      expect(response.body).toBe('test file');

    });

    it('should return file content when file is found with an absolute path', async() => {

      const absolutePath = join(__dirname, '../../test/');
      const absoluteService = new HttpHandlerStaticAssetService(absolutePath, 'text/plain');

      context.request.parameters = { filename: 'test.txt' };
      const response = await lastValueFrom(absoluteService.handle(context));

      expect(response.body).toBe('test file');

    });

  });

});
