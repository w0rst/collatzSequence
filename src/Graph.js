import { ForceGraph2D } from "react-force-graph"



const genRandomTree = (nodes) => {
    return {
      nodes: [...Array(nodes).keys()].map((i) => {
          const random = Math.random()
          const value = Math.ceil(5 * random)
          const blue = Math.floor((Math.E ** (-7 *((random - 1) ** 2))) * 255)
          const green = Math.floor((Math.E ** (-7 *((random - .5) ** 2))) * 255)
          const red = Math.floor((Math.E ** (-7 *(random ** 2))) * 255)
          const color = `rgb(${red}, ${green}, ${blue})`
          return {
            id: i.toString(), 
            val: value,
            name: i + " Node",
            color: color
        }
    }),
        links: [...Array(nodes).keys()]
      .filter(id => id)
      .map(id => ({
        source: id,
        target: Math.round(Math.random() * (id-1)),
        name: id
      }))
    };
  }
let last;
const generateNumbericData = (maxNumber) => {
    const numbers = {
        nodes: [],
        links: []
    };
    const nodeExists = (id) => {
        return !!numbers.nodes.find(node => node.id === id.toString())
    }
    for (let i = 1; i < maxNumber; i++) {
        numbers.nodes.push(
            {
                id: i.toString(),
                val: i,
                name: i
            }
        )
    }
    numbers.links.push(
    {
        source: "2",
        target: "1"
    },
    {
        source: "4",
        target: "2"
    }
    )
    for (let i = 3; i < maxNumber; i++) {
        let pointer = i;
        
        while (pointer !== 4) {
            
            if (pointer % 2) {
                if (!nodeExists(3 * pointer + 1)) {
                    numbers.nodes.push(
                        {
                            id: (3 * pointer + 1).toString(),
                            val: 3 * pointer + 1,
                            name: 3 * pointer + 1
                        }
                    )
                }
                numbers.links.push(
                    {
                        source: pointer.toString(),
                        target: (3 * pointer + 1).toString()
                    }
                )
                pointer = 3 * pointer + 1;
            } else {
                if (!nodeExists(pointer / 2)) {
                    numbers.nodes.push(
                        {
                            id: (pointer / 2).toString(),
                            val: pointer / 2,
                            name: pointer / 2
                        }
                    )
                }
                numbers.links.push(
                    {
                        source: pointer.toString(),
                        target: (pointer / 2).toString()
                    }
                )
                pointer = pointer / 2;
            }
        }
    }
    last = numbers.nodes.sort((node1, node2) => node1.val > node2.val ? -1 : 1)[0].id
    return numbers;
}
const data = generateNumbericData(120)
const Graph = () => {
    console.log(last)
    return (
        <ForceGraph2D
            dagMode="radialin"
            graphData={data}
            linkCurvature={.05}
            linkWidth={2}
            nodeAutoColorBy="group"
            forceEngine ="d3"
            d3Force={"center"}
            linkDirectionalArrowLength={5}
            dagLevelDistance={20}
            
            nodeCanvasObject={(node, context, globalScale) => {
                const label = node.id;
                const normalized = ((last - parseInt(label)) / last) ** 3;
                
                const fontSize = (8 + 6 * normalized) / globalScale;
                
                context.font = `${fontSize}px Sans-Serif`;
                const textWidth = context.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
    
                context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                context.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
    
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillStyle = "#000";
                context.fillText(label, node.x, node.y);
    
                node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
              }}
              nodePointerAreaPaint={(node, color, context) => {
                context.fillStyle = color;
                const bckgDimensions = node.__bckgDimensions;
                bckgDimensions && context.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
              }}
        />
    )
}

export default Graph;