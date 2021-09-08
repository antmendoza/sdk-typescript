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
import fs from "fs";
import {MermaidStateDiagram} from "../../../src/lib/diagram/mermaidStateDiagram";

describe('MermaidStateDiagram', () => {


  it('should generate svg from workflow', (done) => {

      const expected = fs.readFileSync('./tests/examples/parallel.json', 'utf8');

      new MermaidStateDiagram().transform(Workflow.fromSource(expected)).then( svg => {
          expect(svg).toMatch(`<svg id="render"`)
          done();
      })

  });
});
