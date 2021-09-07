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
import { Workflow } from '../../../src/lib/definitions/workflow';
import { WorkflowToMermaidStateDiagram } from '../../../src/lib/diagram/workflowToMermaidStateDiagram';

describe('mermaid', () => {
  it('should generate basic output', () => {
    expect(
      new WorkflowToMermaidStateDiagram().transform(
        Workflow.fromSource(
          '{\n' +
            '  "id": "applicantrequest",\n' +
            '  "version": "1.0",\n' +
            '  "specVersion": "0.7",\n' +
            '  "name": "Applicant Request Decision Workflow",\n' +
            '  "description": "Determine if applicant request is valid",\n' +
            '  "start": "CheckApplication",\n' +
            '  "functions": [\n' +
            '    {\n' +
            '      "name": "sendRejectionEmailFunction",\n' +
            '      "operation": "http://myapis.org/applicationapi.json#emailRejection"\n' +
            '    }\n' +
            '  ],\n' +
            '  "states":[\n' +
            '    {\n' +
            '      "type":"switch",\n' +
            '      "name":"CheckApplication",\n' +
            '      "dataConditions": [\n' +
            '        {\n' +
            '          "condition": "${ .applicants | .age >= 18 }",\n' +
            '          "transition": "StartApplication"\n' +
            '        },\n' +
            '        {\n' +
            '          "condition": "${ .applicants | .age < 18 }",\n' +
            '          "transition": "RejectApplication"\n' +
            '        }\n' +
            '      ],\n' +
            '      "defaultCondition": {\n' +
            '        "transition": "RejectApplication"\n' +
            '      }\n' +
            '    },\n' +
            '    {\n' +
            '      "type": "operation",\n' +
            '      "name": "StartApplication",\n' +
            '      "actions": [\n' +
            '        {\n' +
            '          "subFlowRef": "startApplicationWorkflowId"\n' +
            '        }\n' +
            '      ],\n' +
            '      "end": true\n' +
            '    },\n' +
            '    {\n' +
            '      "type":"operation",\n' +
            '      "name":"RejectApplication",\n' +
            '      "actions":[\n' +
            '        {\n' +
            '          "functionRef": {\n' +
            '            "refName": "sendRejectionEmailFunction",\n' +
            '            "arguments": {\n' +
            '              "applicant": "${ .applicant }"\n' +
            '            }\n' +
            '          }\n' +
            '        }\n' +
            '      ],\n' +
            '      "end": true\n' +
            '    }\n' +
            '  ]\n' +
            '}\n'
        )
      )
    ).toBe(
      `stateDiagram-v2
CheckApplication : CheckApplication
CheckApplication : type = switch

StartApplication : StartApplication
StartApplication : type = operation

RejectApplication : RejectApplication
RejectApplication : type = operation

[*] --> CheckApplication
CheckApplication --> StartApplication : \${ .applicants | .age >= 18 }
CheckApplication --> RejectApplication : \${ .applicants | .age < 18 }
StartApplication --> [*]
RejectApplication --> [*]
`
    );
  });

  it('should generate basic output', () => {
    expect(
      new WorkflowToMermaidStateDiagram().transform(
        Workflow.fromSource(
          '{\n' +
            '  "id": "provisionorders",\n' +
            '  "version": "1.0",\n' +
            '  "specVersion": "0.7",\n' +
            '  "name": "Provision Orders",\n' +
            '  "description": "Provision Orders and handle errors thrown",\n' +
            '  "start": "ProvisionOrder",\n' +
            '  "functions": [\n' +
            '    {\n' +
            '      "name": "provisionOrderFunction",\n' +
            '      "operation": "http://myapis.org/provisioningapi.json#doProvision"\n' +
            '    }\n' +
            '  ],\n' +
            '  "errors": [\n' +
            '    {\n' +
            '      "name": "Missing order id"\n' +
            '    },\n' +
            '    {\n' +
            '      "name": "Missing order item"\n' +
            '    },\n' +
            '    {\n' +
            '      "name": "Missing order quantity"\n' +
            '    }\n' +
            '  ],\n' +
            '  "states":[\n' +
            '    {\n' +
            '      "type":"operation",\n' +
            '      "name":"ProvisionOrder",\n' +
            '      "actions":[\n' +
            '        {\n' +
            '          "functionRef": {\n' +
            '            "refName": "provisionOrderFunction",\n' +
            '            "arguments": {\n' +
            '              "order": "${ .order }"\n' +
            '            }\n' +
            '          }\n' +
            '        }\n' +
            '      ],\n' +
            '      "stateDataFilter": {\n' +
            '        "output": "${ .exceptions }"\n' +
            '      },\n' +
            '      "transition": "ApplyOrder",\n' +
            '      "onErrors": [\n' +
            '        {\n' +
            '          "errorRef": "Missing order id",\n' +
            '          "transition": "MissingId"\n' +
            '        },\n' +
            '        {\n' +
            '          "errorRef": "Missing order item",\n' +
            '          "transition": "MissingItem"\n' +
            '        },\n' +
            '        {\n' +
            '          "errorRef": "Missing order quantity",\n' +
            '          "transition": "MissingQuantity"\n' +
            '        }\n' +
            '      ]\n' +
            '    },\n' +
            '    {\n' +
            '      "type": "operation",\n' +
            '      "name": "MissingId",\n' +
            '      "actions": [\n' +
            '        {\n' +
            '          "subFlowRef": "handleMissingIdExceptionWorkflow"\n' +
            '        }\n' +
            '      ],\n' +
            '      "end": true\n' +
            '    },\n' +
            '    {\n' +
            '      "type": "operation",\n' +
            '      "name": "MissingItem",\n' +
            '      "actions": [\n' +
            '        {\n' +
            '          "subFlowRef": "handleMissingItemExceptionWorkflow"\n' +
            '        }\n' +
            '      ],\n' +
            '      "end": true\n' +
            '    },\n' +
            '    {\n' +
            '      "type": "operation",\n' +
            '      "name": "MissingQuantity",\n' +
            '      "actions": [\n' +
            '        {\n' +
            '          "subFlowRef": "handleMissingQuantityExceptionWorkflow"\n' +
            '        }\n' +
            '      ],\n' +
            '      "end": true\n' +
            '    },\n' +
            '    {\n' +
            '      "type": "operation",\n' +
            '      "name": "ApplyOrder",\n' +
            '      "actions": [\n' +
            '        {\n' +
            '          "subFlowRef": "applyOrderWorkflowId"\n' +
            '        }\n' +
            '      ],\n' +
            '      "end": true\n' +
            '    }\n' +
            '  ]\n' +
            '}'
        )
      )
    ).toBe(
      `stateDiagram-v2
ProvisionOrder : ProvisionOrder
ProvisionOrder : type = operation

MissingId : MissingId
MissingId : type = operation

MissingItem : MissingItem
MissingItem : type = operation

MissingQuantity : MissingQuantity
MissingQuantity : type = operation

ApplyOrder : ApplyOrder
ApplyOrder : type = operation

[*] --> ProvisionOrder
ProvisionOrder --> MissingId : Missing order id
ProvisionOrder --> MissingItem : Missing order item
ProvisionOrder --> MissingQuantity : Missing order quantity
ProvisionOrder --> ApplyOrder
MissingId --> [*]
MissingItem --> [*]
MissingQuantity --> [*]
ApplyOrder --> [*]
`
    );
  });
  it('should generate basic output', () => {
    expect(
      new WorkflowToMermaidStateDiagram().transform(
        Workflow.fromSource(
          '{\n' +
            '  "id": "checkcarvitals",\n' +
            '  "name": "Check Car Vitals Workflow",\n' +
            '  "version": "1.0",\n' +
            '  "specVersion": "0.7",\n' +
            '  "start": "WhenCarIsOn",\n' +
            '  "states": [\n' +
            '    {\n' +
            '      "type": "event",\n' +
            '      "name": "WhenCarIsOn",\n' +
            '      "onEvents": [\n' +
            '        {\n' +
            '          "eventRefs": ["CarTurnedOnEvent"]\n' +
            '        }\n' +
            '      ],\n' +
            '      "transition": "DoCarVitalChecks"\n' +
            '    },\n' +
            '    {\n' +
            '      "type": "operation",\n' +
            '      "name": "DoCarVitalChecks",\n' +
            '      "actions": [\n' +
            '        {\n' +
            '          "subFlowRef": "vitalscheck",\n' +
            '          "sleep": {\n' +
            '            "after": "PT1S"\n' +
            '          }\n' +
            '        }\n' +
            '      ],\n' +
            '      "transition": "CheckContinueVitalChecks"\n' +
            '    },\n' +
            '    {\n' +
            '      "type": "switch",\n' +
            '      "name": "CheckContinueVitalChecks",\n' +
            '      "eventConditions": [\n' +
            '        {\n' +
            '          "name": "Car Turned Off Condition",\n' +
            '          "eventRef": "CarTurnedOffEvent",\n' +
            '          "end": true\n' +
            '        }\n' +
            '      ],\n' +
            '      "defaultCondition": {\n' +
            '        "transition": "DoCarVitalsChecks"\n' +
            '      }\n' +
            '    }\n' +
            '  ],\n' +
            '  "events": [\n' +
            '    {\n' +
            '      "name": "CarTurnedOnEvent",\n' +
            '      "type": "car.events",\n' +
            '      "source": "my/car"\n' +
            '    },\n' +
            '    {\n' +
            '      "name": "CarTurnedOffEvent",\n' +
            '      "type": "car.events",\n' +
            '      "source": "my/car"\n' +
            '    }\n' +
            '  ]\n' +
            '}\n'
        )
      )
    ).toBe(
      `stateDiagram-v2
WhenCarIsOn : WhenCarIsOn
WhenCarIsOn : type = event

DoCarVitalChecks : DoCarVitalChecks
DoCarVitalChecks : type = operation

CheckContinueVitalChecks : CheckContinueVitalChecks
CheckContinueVitalChecks : type = switch

[*] --> WhenCarIsOn
WhenCarIsOn --> DoCarVitalChecks
DoCarVitalChecks --> CheckContinueVitalChecks
CheckContinueVitalChecks --> [*]
`
    );
  });

  xit('should validate workflow before doing the transformation', () => {});
});
