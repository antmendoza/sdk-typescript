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
  normalizeActionMode,
  normalizeActions,
  normalizeEndIfObject,
  normalizeOnErrors,
  normalizeTransitionIfObject,
  normalizeUsedForCompensation,
  overwriteActions,
  overwriteEndIfObject,
  overwriteMetadata,
  overwriteOnErrors,
  overwriteStateDataFilter,
  overwritePropertyAsPlainType,
  overwriteTransitionIfObject,
  setEndValueIfNoTransition,
} from './utils';
import { ActionExecTimeout, StateExecTimeout } from './types';

export class Operationstate {
  constructor(model: any) {
    const defaultModel = {
      type: 'operation',
      actionMode: 'sequential',
      usedForCompensation: false,
    };
    Object.assign(this, defaultModel, model);

    overwriteEndIfObject(this);
    overwriteStateDataFilter(this);
    overwriteActions(this);
    overwritePropertyAsPlainType('timeouts', this);
    overwriteOnErrors(this);
    overwriteTransitionIfObject(this);
    overwriteMetadata(this);
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
  type?: 'operation';
  /**
   * State end definition
   */
  end?: boolean | End;
  /**
   * State data filter
   */
  stateDataFilter?: Statedatafilter;
  /**
   * Specifies whether actions are performed in sequence or in parallel
   */
  actionMode?: 'sequential' | 'parallel';
  /**
   * Actions to be performed
   */
  actions?: Action[];
  /**
   * State specific timeouts
   */
  timeouts?: {
    stateExecTimeout?: StateExecTimeout;
    actionExecTimeout?: /* Single actions definition execution timeout duration (ISO 8601 duration format) */ ActionExecTimeout;
  };
  /**
   * States error handling definitions
   */
  onErrors?: Error[];
  /**
   * Next transition of the workflow after all the actions have been performed
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
   * @returns {Specification.Operationstate} without deleted properties.
   */
  normalize = (): Operationstate => {
    const clone = new Operationstate(this);

    normalizeEndIfObject(clone);
    normalizeActionMode(clone);
    normalizeActions(clone);
    normalizeOnErrors(clone);
    normalizeTransitionIfObject(clone);
    normalizeUsedForCompensation(clone);
    setEndValueIfNoTransition(clone);

    return clone;
  };
}
