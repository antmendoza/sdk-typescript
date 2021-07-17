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
import { Action } from './action';
import { End } from './end';
import { Error } from './error';
import { Metadata } from './metadata';
import { Statedatafilter } from './statedatafilter';
import { Transition } from './transition';
import {
  normalizeEndProperty,
  normalizeOnErrorsProperty,
  normalizeTransitionProperty,
  normalizeUsedForCompensationProperty,
  overwriteActionsValue,
  overwriteEndValueIfObject,
  overwriteMetadataValue,
  overwriteOnErrorsValue,
  overwriteStateDataFilterValue,
  overwriteTransitionValueIfObject,
  setEndValueIfNoTransition,
} from './utils';
import { ActionExecTimeout, StateExecTimeout } from './types';

export class Foreachstate {
  constructor(model: any) {
    const defaultModel = { type: 'foreach', usedForCompensation: false };
    Object.assign(this, defaultModel, model);

    overwriteEndValueIfObject(this);
    overwriteActionsValue(this);
    overwriteStateDataFilterValue(this);
    overwriteOnErrorsValue(this);
    overwriteTransitionValueIfObject(this);
    overwriteMetadataValue(this);
  }

  /**
   * Unique State id
   */
  id?: string;
  /**
   * State name
   */
  name?: string;
  /**
   * State type
   */
  type?: 'foreach';
  /**
   * State end definition
   */
  end?: boolean | End;
  /**
   * Workflow expression selecting an array element of the states data
   */
  inputCollection?: string;
  /**
   * Workflow expression specifying an array element of the states data to add the results of each iteration
   */
  outputCollection?: string;
  /**
   * Name of the iteration parameter that can be referenced in actions/workflow. For each parallel iteration, this param should contain an unique element of the inputCollection array
   */
  iterationParam?: string;
  /**
   * Specifies how upper bound on how many iterations may run in parallel
   */
  max?: number | string;
  /**
   * Actions to be executed for each of the elements of inputCollection
   */
  actions?: Action[];
  /**
   * State specific timeouts
   */
  timeouts?: {
    stateExecTimeout?: /* State execution timeout duration (ISO 8601 duration format) */ StateExecTimeout;
    actionExecTimeout?: /* Single actions definition execution timeout duration (ISO 8601 duration format) */ ActionExecTimeout;
  };
  /**
   * State data filter
   */
  stateDataFilter?: Statedatafilter;
  /**
   * States error handling and retries definitions
   */
  onErrors?: Error[];
  /**
   * Next transition of the workflow after state has completed
   */
  transition?: string | Transition;
  /**
   * Unique Name of a workflow state which is responsible for compensation of this state
   */
  compensatedBy?: string;
  /**
   * If true, this state is used to compensate another state. Default is false
   */
  usedForCompensation?: boolean;
  metadata?: /* Metadata information */ Metadata;

  /**
   * Normalize the value of each property by recursively deleting properties whose value is equal to its default value. Does not modify the object state.
   * @returns {Specification.Foreachstate} without deleted properties.
   */
  normalize = (): Foreachstate => {
    const clone = new Foreachstate(this);

    normalizeUsedForCompensationProperty(clone);
    normalizeOnErrorsProperty(clone);
    normalizeEndProperty(clone);
    normalizeTransitionProperty(clone);
    setEndValueIfNoTransition(clone);

    return clone;
  };
}
