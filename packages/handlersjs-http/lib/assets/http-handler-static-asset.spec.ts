import { TestService, mainModulePath, configPath } from '../../setup-tests';
import { HttpHandlerResponse } from '../general/http-handler-response';
import { HttpHandlerContext } from '../general/http-handler-context';
import { HttpHandlerStaticAssetService } from './http-handler-static-asset';
import { NotFoundHttpError } from '../errors/not-found-http-error';
import { ForbiddenHttpError } from '../errors/forbidden-http-error';
import { UnsupportedMediaTypeHttpError } from '../errors/unsupported-media-type-http-error';

describe('HttpHandlerStaticAssetService', () => {
  let service: HttpHandlerStaticAssetService;
  
  beforeAll(async () => {
    service = await TestService.instantiate('urn:handlersjs-http:test:HttpHandlerStaticAssetService', mainModulePath, configPath);
  });

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
        }
      },
    };
  });

  it('should be correctly instantiated', () => {
    expect(service).toBeTruthy();
  });

  describe('canHandle()', () => {
    it('should always return true', async() => {
      const response = service.canHandle(context).toPromise();
      await expect(response).resolves.toBe(true);
    });
  });

  describe('handle()', () => {
    // it('throws an UnsupportedMediaTypeHttpError when content-type is not supported', async() => {
    //   context.request.headers.accept = 'application/json';
    //   const response = service.handle(context).toPromise();
    //   await expect(response).rejects.toThrowError(new UnsupportedMediaTypeHttpError('Content type not supported'));
    // });

    it('throws a ForbiddenHttpError when filename is invalid', async() => {
      context.request.parameters.filename = '../../test.txt';
      const response = service.handle(context).toPromise();
      await expect(response).rejects.toThrowError(new ForbiddenHttpError(''));
    });

    it('throws a NotFoundHttpError when file is not found', async() => {
      context.request.parameters.filename = 'test.php';
      const response = service.handle(context).toPromise();
      await expect(response).rejects.toThrowError(new NotFoundHttpError('Error while trying to read file'));
    });

    it('should return file content when file is found', async() => {
      context.request.parameters.filename = 'test.txt';
      const response = await service.handle(context).toPromise();
      expect(response.body).toBe('test file');
    });
  });
});
