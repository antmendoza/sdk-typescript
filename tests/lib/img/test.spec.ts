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
import {Specification} from '../../../src/lib/definitions';
import {Workflow} from '../../../src/lib/definitions/workflow';
import {Transitiondatacondition} from '../../../src/lib/definitions/transitiondatacondition';
import {End} from '../../../src/lib/definitions/end';

class MermaidState {
    constructor(
        protected isFirstState: boolean,
        protected state: {
            end?: boolean | End;
            name?: string;
            type?: string;
        }
    ) {
    }

    definition(): string {
        return this.state.name + ' : ' + this.state.name + '\n' +
            this.state.name + ' : type = ' + this.state.type  + '\n\n';
    }

    transitions(): string {
        let transitions = '';
        if (this.isFirstState) {
            transitions += '[*]' + ' --> ' + this.state.name + '\n';
        }

        const switchState = this.state as { dataConditions: Transitiondatacondition[] };
        if(switchState.dataConditions){
            switchState.dataConditions.forEach((dataCondition) => {
                transitions += this.state.name + ' --> ' + dataCondition.transition + " : " + dataCondition.condition + '\n';
            });
        }


        if (this.state.end) {
            transitions += this.state.name + ' --> ' + '[*]' + '\n';
        }

        return transitions;
    }
}


class WorkflowToMermaid {
    transform(workflow: Specification.Workflow) {
        const states = workflow.states.map((state, index) => {
            const isFirstState = index === 0;
            return new MermaidState(isFirstState, state);
        });

        let stateDefinitions = '';
        let transitions = '';
        states.forEach((state: MermaidState) => {
            stateDefinitions += state.definition();
            transitions += state.transitions();
        });

        return 'stateDiagram-v2\n' + stateDefinitions + transitions;
    }
}

describe('mermaid', () => {
    fit('should generate basic output', () => {

        expect(new WorkflowToMermaid().transform(Workflow.fromSource(
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
        ))).toBe(
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
`);

        /**
         stateDiagram-v2
         CheckApplication : CheckApplication
         CheckApplication: type = operation
         CheckApplication: name = RejectApplication
         CheckApplication: actionMode = sequential

         StartApplication: StartApplication
         StartApplication: end = true

         RejectApplication: RejectApplication
         RejectApplication: end = true

         [*] --> CheckApplication
         CheckApplication --> StartApplication : ${ .applicants | .age >= 18 }
         CheckApplication --> RejectApplication : ${ .applicants | .age < 18 }
         StartApplication --> [*]
         RejectApplication --> [*]
         */
    });

    xit('should validate workflow before doing the transformation', () => {

    });
});
