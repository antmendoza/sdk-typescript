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
import {Transition} from "../definitions/transition";
import {End} from "../definitions/end";
import {Error} from "../definitions/error";
import {Transitiondatacondition} from "../definitions/transitiondatacondition";

export class MermaidState {
    constructor(
        protected isFirstState: boolean,
        protected state: {
            name?: string;
            type?: string;
            transition?: string | Transition;
            end?: boolean | End;
            onErrors?: Error[];
        }
    ) {
    }

    definition(): string {
        return this.state.name + ' : ' + this.state.name + '\n' +
            this.state.name + ' : type = ' + this.state.type + '\n\n';
    }

    transitions(): string {
        let transitions = '';
        if (this.isFirstState) {
            transitions += '[*]' + ' --> ' + this.state.name + '\n';
        }

        const switchState = this.state as { dataConditions: Transitiondatacondition[] };
        if (switchState.dataConditions) {
            switchState.dataConditions.forEach((dataCondition) => {
                transitions += this.state.name + ' --> ' + dataCondition.transition + " : " + dataCondition.condition + '\n';
            });
        }


        if (this.state.onErrors) {
            this.state.onErrors.forEach((error) => {
                transitions += this.state.name + ' --> ' + error.transition + " : " + error.errorRef + '\n';
            });
        }

        if (this.state.transition) {
            transitions += this.state.name + ' --> ' + this.state.transition + '\n';
        }


        if (this.state.end) {
            transitions += this.state.name + ' --> ' + '[*]' + '\n';
        }

        return transitions;
    }
}