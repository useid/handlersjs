import { Daemon } from '@useid/handlersjs-core';

/**
 * A {Daemon} process listening on a given `scheme``://``host``:``port` location
 *
 */
export abstract class Server extends Daemon {

  /**
   * Creates a new {Server} that will listen on specified `scheme``://``host``:``port`.
   *
   * @param {string} scheme - the url scheme of the location on which the server will listen
   * @param {string} host - the host name of the location on which the server will listen
   * @param {number} port - the port number of the location on which the server will listen
   */
  constructor(protected scheme: string, protected host: string, protected port: number) {

    super();

  }

}
