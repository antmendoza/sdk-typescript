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

import { overwritePropertyAsPlainType } from './utils';

export class Eventref {
  constructor(model: any) {
    Object.assign(this, model);
    overwritePropertyAsPlainType('data', this);
    overwritePropertyAsPlainType('contextAttributes', this);
  }

  /**
   * Reference to the unique name of a 'produced' event definition
   */
  triggerEventRef: string;
  /**
   * Reference to the unique name of a 'consumed' event definition
   */
  resultEventRef: string;
  /**
   * If string type, an expression which selects parts of the states data output to become the data (payload) of the event referenced by 'triggerEventRef'. If object type, a custom object to become the data (payload) of the event referenced by 'triggerEventRef'.
   */
  data?:
    | string
    | {
        [key: string]: any;
      };
  /**
   * Add additional extension context attributes to the produced event
   */
  contextAttributes?: {
    [name: string]: string;
  };
}
