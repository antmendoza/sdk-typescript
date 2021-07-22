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
import { Specification } from '.';
import * as yaml from 'js-yaml';

import { validate } from '../utils';
import { Metadata } from './metadata';
import { Startdef } from './startdef';
import { Events, Functions, Retries, Secrets, States } from './types';
import {
  normalizeEvents,
  normalizeExpressionLang,
  normalizeFunctions,
  normalizeKeepActive,
  normalizeStates,
  normalizeTimeoutsIfObject,
  overwriteConstantsIfObjectAsPlainType,
  overwriteDataInputSchemaIfObjectAsPlainType,
  overwriteEvents,
  overwriteFunctions,
  overwriteMetadata,
  overwriteRetries,
  overwriteStartIfObject,
  overwriteStates,
  overwriteTimeoutsIfObject,
} from './utils';
import { Timeouts } from './timeouts';

export class Workflow {
  constructor(model: any) {
    const defaultModel = {
      expressionLang: 'jq',
      keepActive: true,
    } as Specification.Workflow;


    Object.assign(this, defaultModel, model);

    overwriteDataInputSchemaIfObjectAsPlainType(this);
    overwriteConstantsIfObjectAsPlainType(this);
    overwriteStartIfObject(this);
    overwriteTimeoutsIfObject(this);
    overwriteMetadata(this);
    overwriteEvents(this);
    overwriteFunctions(this);
    overwriteRetries(this);
    overwriteStates(this);
  }

  /**
   * Workflow unique identifier
   */
  id: string;
  /**
   * Domain-specific workflow identifier
   */
  key?: string;
  /**
   * Workflow name
   */
  name: string;
  /**
   * Workflow description
   */
  description?: string;
  /**
   * Workflow version
   */
  version?: string;
  /**
   * List of helpful terms describing the workflows intended purpose, subject areas, or other important qualities
   */
  annotations?: [string, ...string[]];
  dataInputSchema?:
    | string
    | {
        /**
         * URI of the JSON Schema used to validate the workflow data input
         */
        schema: string;
        /**
         * Determines if workflow execution should continue if there are validation errors
         */
        failOnValidationErrors: boolean;
      };
  secrets?: Secrets;
  constants?:
    | string /* uri */
    | {
        [key: string]: any;
      };
  start: string | Startdef;
  /**
   * Serverless Workflow schema version
   */
  specVersion: string;
  /**
   * Identifies the expression language used for workflow expressions. Default is 'jq'
   */
  expressionLang?: string;
  timeouts?: string /* uri */ | Timeouts;
  /**
   * If 'true', workflow instances is not terminated when there are no active execution paths. Instance can be terminated via 'terminate end definition' or reaching defined 'workflowExecTimeout'
   */
  keepActive?: boolean;
  metadata?: /* Metadata information */ Metadata;
  events?: Events;
  functions?: Functions;
  retries?: Retries;
  /**
   * State definitions
   */
  states: States;
  /**
   * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
   * @returns {Specification.Workflow} without deleted properties.
   */
  normalize = (): Workflow => {
    const clone = new Workflow(this);

    normalizeExpressionLang(clone);
    normalizeTimeoutsIfObject(clone);
    normalizeKeepActive(clone);
    normalizeEvents(clone);
    normalizeFunctions(clone);
    normalizeStates(clone);

    return clone;
  };

  /**
   * Parses the provided string as Workflow
   * @param {string} data The JSON or YAML workflow to parse
   * @returns {Workflow} The parse Workflow
   */
  static fromSource(value: string): Specification.Workflow {
    try {
      const model = yaml.load(value);
      return new Workflow(model);
    } catch (ex) {
      throw new Error('Format not supported');
    }
  }

  /**
   * Stringifies the provided workflow to the JSON format
   * @param {Workflow} workflow The workflow to strigify
   * @returns {string} The workflow as JSON
   */
  static toJson(workflow: Workflow): string {
    validate('Workflow', workflow);
    return JSON.stringify(workflow.normalize());
  }

  /**
   * Stringifies the provided workflow to the YAML format
   * @param {Workflow} workflow The workflow to strigify
   * @returns {string} The workflow as YAML
   */
  static toYaml(workflow: Workflow): string {
    validate('Workflow', workflow);
    return yaml.dump(JSON.parse(JSON.stringify(workflow.normalize())));
  }
}
