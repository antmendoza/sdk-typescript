/*
 * Copyright 2021-Present The Serverless Workflow Specification Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { overwriteContextAttributesAsPlainType, overwriteDataIfObjectAsPlainType } from './utils';

export class Produceeventdef {
  constructor(model: any) {
    Object.assign(this, model);
    overwriteDataIfObjectAsPlainType(this);
    overwriteContextAttributesAsPlainType(this);
  }

  /**
   * References a name of a defined event
   */
  eventRef: string;
  /**
   * If String, expression which selects parts of the states data output to become the data of the produced event. If object a custom object to become the data of produced event.
   */
  data?:
    | string
    | {
        [key: string]: any;
      };
  /**
   * Add additional event extension context attributes
   */
  contextAttributes?: {
    [name: string]: string;
  };
}
