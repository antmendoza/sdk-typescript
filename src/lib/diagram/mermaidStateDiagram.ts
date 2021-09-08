import {Specification} from "../definitions";
import { renderMermaid } from 'mermaid-render';
import {MermaidStateCode} from "./mermaidStateCode";

export class MermaidStateDiagram {

    async transform(workflow: Specification.Workflow): Promise<string> {
        const svg = await renderMermaid(
            new MermaidStateCode().transform(workflow)
        );
        return svg;
    }

}
