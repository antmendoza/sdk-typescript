import { renderMermaid } from 'mermaid-render';


export class WorkflowImg {




    toSVG = async (): Promise<string> => {
        const svg = await renderMermaid(
            `pie title NETFLIX
        "Time spent looking for movie" : 90
        "Time spent watching it" : 10`
        );
        console.log(svg);


        return "";

    }


}

new WorkflowImg().toSVG();
