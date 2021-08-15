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

import * as fs from 'fs';
import {
  eventdefBuilder,
  subflowrefBuilder,
  actionBuilder,
  operationstateBuilder,
  eventstateBuilder,
  oneventsBuilder,
  workflowBuilder,
  eventrefBuilder,
} from '../../src';

describe('checkcarvitals workflow example', () => {
  it('should generate Workflow object', function () {
    const workflow = workflowBuilder()
      .id('checkcarvitals')
      .name('Check Car Vitals Workflow')
      .version('1.0')
      .specVersion('0.7')
      .start('WhenCarIsOn')
      .states([
        eventstateBuilder()
          .name('WhenCarIsOn')
          .onEvents([oneventsBuilder().eventRefs(['CarTurnedOnEvent']).build()])
          .transition('DoCarVitalsChecks')
          .build(),
        operationstateBuilder()
          .name('DoCarVitalsChecks')
          .actions([
            actionBuilder()
              .subFlowRef(subflowrefBuilder().workflowId('vitalscheck').build())
              .build(),
          ])
          .transition('WaitForCarStopped')
          .build(),
        eventstateBuilder()
          .name('WaitForCarStopped')
          .onEvents([
            oneventsBuilder()
              .eventRefs(['CarTurnedOffEvent'])
              .actions([
                actionBuilder()
                  .eventRef(
                    eventrefBuilder().triggerEventRef('StopVitalsCheck').resultEventRef('VitalsCheckingStopped').build()
                  )
                  .build(),
              ])
              .build(),
          ])
          .build(),
      ])
      .events([
        eventdefBuilder().name('CarTurnedOnEvent').type('car.events').source('my/car').build(),
        eventdefBuilder().name('CarTurnedOffEvent').type('car.events').source('my/car').build(),
        eventdefBuilder().name('StopVitalsCheck').type('car.events').source('my/car').build(),
        eventdefBuilder().name('VitalsCheckingStopped').type('car.events').source('my/car').build(),
      ])
      .build();

    const expected = JSON.parse(fs.readFileSync('./tests/examples/checkcarvitals.json', 'utf8'));
    expect(JSON.stringify(workflow.normalize())).toEqual(JSON.stringify(expected));
  });
});
